import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/admin-data";
import { getCurrentAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const logs = await getAuditLogs(200);
  return NextResponse.json({ logs }, { status: 200 });
}
