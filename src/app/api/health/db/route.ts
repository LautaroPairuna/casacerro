import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Para el chequeo de salud: responde solo si la base contesta. El detalle del
// error y el uso de memoria van al log, no a la respuesta pública (un mensaje
// del driver puede mostrar el host o el usuario de la base).
export async function GET() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "healthy", latency: `${Date.now() - start}ms` });
  } catch (error) {
    console.error("Database health check failed:", error, {
      memory: process.memoryUsage(),
    });
    return NextResponse.json({ status: "unhealthy" }, { status: 503 });
  }
}
