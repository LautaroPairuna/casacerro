import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
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

export async function POST(request: Request) {
  try {
    await ensureAdminBootstrap();
    await ensureTariffBootstrap();

    const body = await request.json();
    const { email, password } = parseLoginPayload(body);

    const admin = await getAdminByEmail(email);
    if (!admin) {
      return NextResponse.json({ message: "Credenciales inválidas." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Credenciales inválidas." }, { status: 401 });
    }

    await updateLastLogin(admin.id);
    const token = await createSessionToken({
      sub: String(admin.id),
      email: admin.email,
      role: "admin",
    });

    const cookieStore = await cookies();
    cookieStore.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getSessionDurationSeconds(),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Datos de inicio de sesión inválidos.",
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "No fue posible iniciar sesión en este momento." },
      { status: 500 }
    );
  }
}
