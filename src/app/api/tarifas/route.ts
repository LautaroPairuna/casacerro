import { NextResponse } from "next/server";
import { ensureTariffBootstrap, getRoomTypesWithRates, getTariffInfo } from "@/lib/admin-data";

export async function GET() {
  await ensureTariffBootstrap();
  const roomTypes = await getRoomTypesWithRates();
  const tariffInfo = await getTariffInfo();

  return NextResponse.json({ roomTypes, tariffInfo }, { status: 200 });
}
