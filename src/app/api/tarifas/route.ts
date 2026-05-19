import { NextResponse } from "next/server";
import { getTariffCatalog } from "@/lib/admin-data";

export async function GET() {
  const { roomTypes, tariffInfo } = await getTariffCatalog();

  return NextResponse.json({ roomTypes, tariffInfo }, { status: 200 });
}
