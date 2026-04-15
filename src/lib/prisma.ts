import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const rawDatabaseUrl =
  process.env.DATABASE_URL ?? "mysql://casacerro:soslmyexoaumija9@casacerro-database-nxoer9:3306/casacerro";

function buildDatabaseUrl(rawUrl: string): string {
  const parsed = new URL(rawUrl);

  if (parsed.hostname === "localhost") {
    parsed.hostname = "127.0.0.1";
  }

  if (!parsed.searchParams.has("allowPublicKeyRetrieval")) {
    parsed.searchParams.set("allowPublicKeyRetrieval", "true");
  }

  return parsed.toString();
}

const databaseUrl = buildDatabaseUrl(rawDatabaseUrl);
const adapter = new PrismaMariaDb(databaseUrl);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
