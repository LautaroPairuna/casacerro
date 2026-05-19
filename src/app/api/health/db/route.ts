import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatMegabytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
}

export async function GET() {
  const start = Date.now();
  const memoryUsage = process.memoryUsage();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      latency: `${latency}ms`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      pool: "PrismaMariaDb Adapter",
      memory: {
        rss: formatMegabytes(memoryUsage.rss),
        heapTotal: formatMegabytes(memoryUsage.heapTotal),
        heapUsed: formatMegabytes(memoryUsage.heapUsed),
        external: formatMegabytes(memoryUsage.external),
      },
    }, { status: 200 });
  } catch (error) {
    const latency = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Database health check failed:", error);

    return NextResponse.json({
      status: "unhealthy",
      database: "disconnected",
      latency: `${latency}ms`,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      memory: {
        rss: formatMegabytes(memoryUsage.rss),
        heapTotal: formatMegabytes(memoryUsage.heapTotal),
        heapUsed: formatMegabytes(memoryUsage.heapUsed),
        external: formatMegabytes(memoryUsage.external),
      },
    }, { status: 503 });
  }
}
