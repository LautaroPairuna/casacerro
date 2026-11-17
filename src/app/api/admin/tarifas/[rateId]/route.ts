import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import {
  deleteRate,
  DuplicateRateLabelError,
  moveRate,
  parseMoveRatePayload,
  parseUpdateRatePayload,
  updateRate,
} from "@/lib/admin-data";
import { getCurrentAdminSession } from "@/lib/admin-session";

const PARAMS_SCHEMA = z.object({
  rateId: z.coerce.number().int().positive(),
});

type RouteContext = { params: Promise<{ rateId: string }> };

function revalidateTariffs() {
  revalidateTag("tariff-catalog", "max");
  revalidatePath("/");
}

function errorResponse(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Revisá los datos: nombre (2 a 100 caracteres), personas (1 a 10) y precio mayor a 0.", issues: error.issues },
      { status: 400 }
    );
  }
  if (error instanceof DuplicateRateLabelError) {
    return NextResponse.json({ message: error.message }, { status: 409 });
  }
  return NextResponse.json({ message: fallback }, { status: 500 });
}

/** Actualiza precio y, opcionalmente, nombre y cantidad de personas. */
export async function PUT(request: Request, context: RouteContext) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const { rateId } = PARAMS_SCHEMA.parse(await context.params);
    const body = await request.json();
    const payload = parseUpdateRatePayload({
      roomTypeId: body.roomTypeId,
      price: body.price,
      label: body.label,
      people: body.people,
      rateId,
    });

    const updated = await updateRate(payload, session.email);
    if (!updated) {
      return NextResponse.json({ message: "Tarifa no encontrada." }, { status: 404 });
    }

    revalidateTariffs();
    return NextResponse.json({ rate: updated }, { status: 200 });
  } catch (error) {
    return errorResponse(error, "No se pudo actualizar la tarifa.");
  }
}

/** Mueve la tarifa un lugar arriba o abajo: body { direction: "up" | "down" }. */
export async function PATCH(request: Request, context: RouteContext) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const { rateId } = PARAMS_SCHEMA.parse(await context.params);
    const body = await request.json();
    const result = await moveRate(
      parseMoveRatePayload({ rateId, direction: body.direction }),
      session.email
    );
    if (!result) {
      return NextResponse.json({ message: "Tarifa no encontrada." }, { status: 404 });
    }

    if (result.moved) revalidateTariffs();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return errorResponse(error, "No se pudo cambiar el orden.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const { rateId } = PARAMS_SCHEMA.parse(await context.params);
    const deleted = await deleteRate(rateId, session.email);
    if (!deleted) {
      return NextResponse.json({ message: "Tarifa no encontrada." }, { status: 404 });
    }

    revalidateTariffs();
    return NextResponse.json({ rate: deleted }, { status: 200 });
  } catch (error) {
    return errorResponse(error, "No se pudo eliminar la tarifa.");
  }
}
