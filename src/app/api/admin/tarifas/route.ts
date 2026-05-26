import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getTariffCatalog,
  parseUpdateTariffInfoPayload,
  updateTariffInfo,
} from "@/lib/admin-data";
import { getCurrentAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { roomTypes, tariffInfo } = await getTariffCatalog();

  return NextResponse.json({ roomTypes, tariffInfo }, { status: 200 });
}

export async function PUT(request: Request) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = parseUpdateTariffInfoPayload(body);
    const updated = await updateTariffInfo(payload, session.email);

    if (!updated) {
      return NextResponse.json({ message: "Información no encontrada." }, { status: 404 });
    }

    revalidateTag("tariff-catalog", "max");
    revalidatePath("/");

    return NextResponse.json({ tariffInfo: updated }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Payload inválido.", issues: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "No se pudo actualizar la información de tarifas." },
      { status: 500 }
    );
  }
}
