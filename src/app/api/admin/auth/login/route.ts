import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  createSessionToken,
  getSessionCookieName,
  getSessionDurationSeconds,
  parseLoginPayload,
} from "@/lib/admin-auth";
import {
  ensureAdminBootstrap,
  ensureTariffBootstrap,
  getAdminByEmail,
  updateLastLogin,
} from "@/lib/admin-data";
import {
  ipDelPedido,
  limpiarFallos,
  registrarFallo,
  segundosDeBloqueo,
} from "@/lib/login-throttle";

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  const start = Date.now();
  const ip = ipDelPedido(request.headers);

  try {
    const espera = segundosDeBloqueo(ip);
    if (espera > 0) {
      return NextResponse.json(
        { message: "Demasiados intentos fallidos. Esperá unos minutos antes de volver a probar." },
        { status: 429, headers: { "Retry-After": String(espera) } },
      );
    }

    console.log(`[AUTH][${requestId}] Inicio de intento de login`);
    
    await ensureAdminBootstrap();
    await ensureTariffBootstrap();

    const body = await request.json();
    const { email, password } = parseLoginPayload(body);
    
    console.log(`[AUTH][${requestId}] Validando usuario: ${email}`);

    const admin = await getAdminByEmail(email);
    if (!admin) {
      console.warn(`[AUTH][${requestId}] Usuario no encontrado: ${email}`);
      registrarFallo(ip);
      return NextResponse.json({ message: "Credenciales inválidas." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      console.warn(`[AUTH][${requestId}] Contraseña incorrecta para: ${email}`);
      registrarFallo(ip);
      return NextResponse.json({ message: "Credenciales inválidas." }, { status: 401 });
    }

    console.log(`[AUTH][${requestId}] Credenciales válidas. Actualizando último acceso...`);
    limpiarFallos(ip);
    await updateLastLogin(admin.id);
    
    const token = await createSessionToken({
      sub: String(admin.id),
      email: admin.email,
      role: "admin",
    });

    console.log(`[AUTH][${requestId}] Token JWT generado exitosamente`);

    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttpsRequest =
      forwardedProto?.split(",")[0]?.trim() === "https" || new URL(request.url).protocol === "https:";
    const secureCookie = process.env.NODE_ENV === "production" ? isHttpsRequest : false;

    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: secureCookie,
      sameSite: "lax",
      path: "/",
      maxAge: getSessionDurationSeconds(),
    });

    const duration = Date.now() - start;
    console.log(
      `[AUTH][${requestId}] Login exitoso para ${email} en ${duration}ms (secureCookie=${String(secureCookie)})`
    );

    return response;
  } catch (error) {
    const duration = Date.now() - start;
    
    if (error instanceof ZodError) {
      console.warn(`[AUTH][${requestId}] Error de validación Zod en ${duration}ms:`, error.issues);
      return NextResponse.json(
        {
          message: "Datos de inicio de sesión inválidos.",
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    console.error(`[AUTH][${requestId}] ERROR CRÍTICO en login después de ${duration}ms:`, error);
    return NextResponse.json(
      { message: "No fue posible iniciar sesión en este momento." },
      { status: 500 }
    );
  }
}
