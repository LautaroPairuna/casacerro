import { NextResponse } from "next/server";
import { ensureTariffBootstrap, getRoomTypesWithRates } from "@/lib/admin-data";

export async function GET() {
  await ensureTariffBootstrap();
  const roomTypes = await getRoomTypesWithRates();

  return NextResponse.json({ roomTypes }, { status: 200 });
}
