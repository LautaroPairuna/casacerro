import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { parseUpdateRatePayload, updateRatePrice } from "@/lib/admin-data";
import { getCurrentAdminSession } from "@/lib/admin-session";

const PARAMS_SCHEMA = z.object({
  rateId: z.coerce.number().int().positive(),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ rateId: string }> }
) {
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
      rateId,
    });

    const updated = await updateRatePrice(payload, session.email);
    if (!updated) {
      return NextResponse.json({ message: "Tarifa no encontrada." }, { status: 404 });
    }

    revalidateTag("tariff-catalog", "max");
    revalidatePath("/");

    return NextResponse.json({ rate: updated }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Payload inválido.", issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "No se pudo actualizar la tarifa." },
      { status: 500 }
    );
  }
}
