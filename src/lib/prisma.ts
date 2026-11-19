import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Este fallback es sólo para desarrollo local sin un .env a mano. En
// producción DATABASE_URL tiene que venir siempre del entorno de Dokploy: si
// el deploy termina usando esta credencial hardcodeada es porque esa
// variable no está configurada ahí, y vale la pena saberlo — apunta a un
// hostname interno de Dokploy que puede no existir más.
const LOCAL_DEV_FALLBACK_URL =
  "mysql://casacerro:soslmyexoaumija9@casacerro-database-nxoer9:3306/casacerro";

function resolveDatabaseUrl(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    // No se corta el arranque por esto (una var mal seteada en un deploy no
    // debería tirar abajo todo el sitio), pero sí queda gritando en los logs
    // del servicio en Dokploy: si esto aparece, la causa casi segura de "no
    // toma los datos de la base" está acá, no en el código de la app.
    console.error(
      "[prisma] DATABASE_URL no está definida en producción. " +
        "Usando la URL de desarrollo local como último recurso — " +
        "revisá las variables de entorno del servicio en Dokploy."
    );
  }

  return LOCAL_DEV_FALLBACK_URL;
}

const rawDatabaseUrl = resolveDatabaseUrl();

function buildDatabaseUrl(rawUrl: string): string {
  const parsed = new URL(rawUrl);

  if (parsed.hostname === "localhost") {
    parsed.hostname = "127.0.0.1";
  }

  if (!parsed.searchParams.has("allowPublicKeyRetrieval")) {
    parsed.searchParams.set("allowPublicKeyRetrieval", "true");
  }

  // Pool de 5 que cierra lo que no usa: el driver, por defecto, abre 10 y las
  // deja abiertas aunque no se usen (minimumIdle = connectionLimit). Así se
  // cierran al minuto sin uso, porque la base es compartida con otros sitios.
  const pool = { connectionLimit: "5", minimumIdle: "0", idleTimeout: "60" };
  for (const [clave, valor] of Object.entries(pool)) {
    if (!parsed.searchParams.has(clave)) parsed.searchParams.set(clave, valor);
  }

  return parsed.toString();
}

const databaseUrl = buildDatabaseUrl(rawDatabaseUrl);
const adapter = new PrismaMariaDb(databaseUrl);

// También en producción: un solo pool por proceso aunque el módulo se cargue
// desde más de un bundle.
export const prisma = (globalForPrisma.prisma ??= new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
}));
