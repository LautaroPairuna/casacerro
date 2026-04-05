import { NextResponse } from "next/server";
import { ensureTariffBootstrap, getRoomTypesWithRates } from "@/lib/admin-data";
import { getCurrentAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  await ensureTariffBootstrap();
  const roomTypes = await getRoomTypesWithRates();

  return NextResponse.json({ roomTypes }, { status: 200 });
}
