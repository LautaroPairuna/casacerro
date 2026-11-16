import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  createRate,
  DuplicateRateLabelError,
  getTariffCatalogFresh,
  parseCreateRatePayload,
  parseUpdateTariffInfoPayload,
  updateTariffInfo,
} from "@/lib/admin-data";
import { getCurrentAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { roomTypes, tariffInfo } = await getTariffCatalogFresh();

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

/** Agrega una tarifa (fila) a un tipo de habitación. */
export async function POST(request: Request) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const payload = parseCreateRatePayload(await request.json());
    const created = await createRate(payload, session.email);

    if (!created) {
      return NextResponse.json({ message: "Tipo de habitación no encontrado." }, { status: 404 });
    }

    revalidateTag("tariff-catalog", "max");
    revalidatePath("/");

    return NextResponse.json({ rate: created }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Revisá los datos: nombre (2 a 100 caracteres), personas (1 a 10) y precio mayor a 0.", issues: error.issues },
        { status: 400 }
      );
    }
    if (error instanceof DuplicateRateLabelError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    return NextResponse.json({ message: "No se pudo agregar la tarifa." }, { status: 500 });
  }
}
