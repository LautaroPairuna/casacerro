import bcrypt from "bcryptjs";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type SeedRate = {
  label: string;
  people: number;
  price: number;
  displayOrder: number;
};

type SeedRoomType = {
  code: string;
  name: string;
  badge: string;
  description: string;
  displayOrder: number;
  rates: SeedRate[];
};

const DEFAULT_ROOM_TYPES: SeedRoomType[] = [
  {
    code: "monoambientes",
    name: "Monoambientes",
    badge: "Hasta 4 personas",
    description:
      "Ambiente integrado con todo lo necesario para una estadía cómoda y agradable.",
    displayOrder: 1,
    rates: [
      { label: "Single / Doble Standard", people: 2, price: 69000, displayOrder: 1 },
      { label: "Single / Doble Superior", people: 2, price: 79000, displayOrder: 2 },
      { label: "Triple", people: 3, price: 89000, displayOrder: 3 },
      { label: "Cuádruple", people: 4, price: 98000, displayOrder: 4 },
    ],
  },
  {
    code: "dos-ambientes",
    name: "Dos Ambientes",
    badge: "Hasta 4 personas",
    description:
      "Ambientes separados, mayor privacidad y espacio. Ideal para familias o grupos.",
    displayOrder: 2,
    rates: [
      { label: "Doble Superior", people: 2, price: 85000, displayOrder: 1 },
      { label: "Triple", people: 3, price: 95000, displayOrder: 2 },
      { label: "Cuádruple", people: 4, price: 118000, displayOrder: 3 },
    ],
  },
];

const DEFAULT_TARIFF_INFO = {
  parkingNote: "Cochera $9.000 por día. Sujeta a disponibilidad.",
  seasonalNote:
    "Los precios pueden variar sin previo aviso en temporada alta y fines de semana largos.",
  validityNote: "Valores vigentes hasta el 31 de marzo de 2026.",
  extraNotes: [] as string[],
};

// Campos editables de una fila del tarifario. El nombre es único dentro de
// cada tipo de habitación (índice único en la base).
const RATE_LABEL = z.string().trim().min(2).max(100);
const RATE_PEOPLE = z.int().min(1).max(10);
const RATE_PRICE = z.int().positive().max(999999999);

const UPDATE_RATE_SCHEMA = z.object({
  roomTypeId: z.int().positive(),
  rateId: z.int().positive(),
  price: RATE_PRICE,
  // Opcionales: si no vienen, se conservan los actuales.
  label: RATE_LABEL.optional(),
  people: RATE_PEOPLE.optional(),
});

const CREATE_RATE_SCHEMA = z.object({
  roomTypeId: z.int().positive(),
  label: RATE_LABEL,
  people: RATE_PEOPLE,
  price: RATE_PRICE,
});

const MOVE_RATE_SCHEMA = z.object({
  rateId: z.int().positive(),
  direction: z.enum(["up", "down"]),
});

const UPDATE_TARIFF_INFO_SCHEMA = z.object({
  parkingNote: z.string().trim().min(5).max(220),
  seasonalNote: z.string().trim().min(5).max(320),
  validityNote: z.string().trim().min(5).max(220),
  extraNotes: z.array(z.string().trim().min(5).max(220)).max(8).default([]),
});

type TxClient = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">;

export type UpdateRatePayload = z.infer<typeof UPDATE_RATE_SCHEMA>;
export type CreateRatePayload = z.infer<typeof CREATE_RATE_SCHEMA>;
export type MoveRatePayload = z.infer<typeof MOVE_RATE_SCHEMA>;

/** Ya existe otra tarifa con ese nombre en el mismo tipo de habitación. */
export class DuplicateRateLabelError extends Error {
  constructor(label: string) {
    super(`Ya existe una tarifa llamada "${label}" en esta habitación.`);
    this.name = "DuplicateRateLabelError";
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

export function parseCreateRatePayload(input: unknown): CreateRatePayload {
  return CREATE_RATE_SCHEMA.parse(input);
}

export function parseMoveRatePayload(input: unknown): MoveRatePayload {
  return MOVE_RATE_SCHEMA.parse(input);
}
export type UpdateTariffInfoPayload = z.infer<typeof UPDATE_TARIFF_INFO_SCHEMA>;

export function parseUpdateRatePayload(input: unknown): UpdateRatePayload {
  return UPDATE_RATE_SCHEMA.parse(input);
}

export function parseUpdateTariffInfoPayload(input: unknown): UpdateTariffInfoPayload {
  return UPDATE_TARIFF_INFO_SCHEMA.parse(input);
}

function normalizeExtraNotes(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export async function ensureAdminBootstrap(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en variables de entorno.");
  }

  if (adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 8 caracteres.");
  }

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
      },
    });
    await prisma.auditLog.create({
      data: {
        actorEmail: adminEmail,
        action: "CREAR",
        entity: "usuario_administrador",
        entityId: adminEmail,
        nextData: { correo: adminEmail },
      },
    });
    return;
  }

  const passwordMatches = await bcrypt.compare(adminPassword, existingAdmin.passwordHash);
  if (passwordMatches) {
    return;
  }

  const nextPasswordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.update({
    where: { id: existingAdmin.id },
    data: { passwordHash: nextPasswordHash },
  });
  await prisma.auditLog.create({
    data: {
      actorEmail: adminEmail,
      action: "ACTUALIZAR",
      entity: "usuario_administrador",
      entityId: adminEmail,
      previousData: { cambio: "credenciales" },
      nextData: { cambio: "credenciales" },
    },
  });
}

export async function ensureTariffBootstrap(): Promise<void> {
  const existing = await prisma.roomType.count();
  if (existing === 0) {
    await prisma.$transaction(async (tx: TxClient) => {
      for (const roomType of DEFAULT_ROOM_TYPES) {
        await tx.roomType.create({
          data: {
            code: roomType.code,
            name: roomType.name,
            badge: roomType.badge,
            description: roomType.description,
            displayOrder: roomType.displayOrder,
            rates: {
              create: roomType.rates.map((rate) => ({
                label: rate.label,
                people: rate.people,
                price: rate.price,
                displayOrder: rate.displayOrder,
              })),
            },
          },
        });
      }
    });
  }

  await prisma.tariffInfo.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      parkingNote: DEFAULT_TARIFF_INFO.parkingNote,
      seasonalNote: DEFAULT_TARIFF_INFO.seasonalNote,
      validityNote: DEFAULT_TARIFF_INFO.validityNote,
      extraNotes: DEFAULT_TARIFF_INFO.extraNotes,
    },
    update: {},
  });
}

export async function getAdminByEmail(email: string) {
  return prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function updateLastLogin(adminId: number): Promise<void> {
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { lastLoginAt: new Date() },
  });
}

async function findRoomTypesWithRates() {
  return prisma.roomType.findMany({
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      code: true,
      name: true,
      badge: true,
      description: true,
      rates: {
        orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
        select: {
          id: true,
          label: true,
          people: true,
          price: true,
        },
      },
    },
  });
}

async function findTariffInfo() {
  return prisma.tariffInfo.findUnique({
    where: { id: 1 },
    select: {
      parkingNote: true,
      seasonalNote: true,
      validityNote: true,
      extraNotes: true,
    },
  }).then((tariffInfo) => {
    if (!tariffInfo) {
      return null;
    }

    return {
      parkingNote: tariffInfo.parkingNote,
      seasonalNote: tariffInfo.seasonalNote,
      validityNote: tariffInfo.validityNote,
      extraNotes: normalizeExtraNotes(tariffInfo.extraNotes),
    };
  });
}

export async function getTariffInfo() {
  const catalog = await getTariffCatalog();
  return catalog.tariffInfo;
}

const getCachedTariffCatalog = unstable_cache(
  async () => {
    await ensureTariffBootstrap();

    const [roomTypes, tariffInfo] = await Promise.all([
      findRoomTypesWithRates(),
      findTariffInfo(),
    ]);

    return { roomTypes, tariffInfo };
  },
  ["tariff-catalog"],
  {
    tags: ["tariff-catalog"],
    revalidate: false,
  }
);

export async function getTariffCatalog() {
  return getCachedTariffCatalog();
}

/**
 * Lectura sin caché, para el panel de admin: después de agregar, mover o
 * borrar una tarifa el panel vuelve a pedir el catálogo y tiene que ver el
 * cambio ya. La caché pública se revalida con perfil "max" (sirve el valor
 * anterior una vez mientras se actualiza), que para la web está bien pero
 * en el admin mostraría la lista vieja.
 */
export async function getTariffCatalogFresh() {
  await ensureTariffBootstrap();
  const [roomTypes, tariffInfo] = await Promise.all([
    findRoomTypesWithRates(),
    findTariffInfo(),
  ]);
  return { roomTypes, tariffInfo };
}

export async function getRoomTypesWithRates() {
  await ensureTariffBootstrap();
  const catalog = await getCachedTariffCatalog();
  return catalog.roomTypes;
}

const RATE_SELECT = {
  id: true,
  roomTypeId: true,
  label: true,
  people: true,
  price: true,
} as const;

export async function updateRate(input: UpdateRatePayload, actorEmail: string) {
  try {
    return await prisma.$transaction(async (tx: TxClient) => {
      const rate = await tx.roomRate.findUnique({
        where: { id: input.rateId },
        select: RATE_SELECT,
      });

      if (!rate || rate.roomTypeId !== input.roomTypeId) {
        return null;
      }

      const updated = await tx.roomRate.update({
        where: { id: input.rateId },
        data: {
          price: input.price,
          label: input.label ?? rate.label,
          people: input.people ?? rate.people,
        },
        select: RATE_SELECT,
      });

      await tx.auditLog.create({
        data: {
          actorEmail,
          action: "ACTUALIZAR",
          entity: "tarifa_habitacion",
          entityId: String(updated.id),
          previousData: { precio: rate.price, etiqueta: rate.label, personas: rate.people },
          nextData: { precio: updated.price, etiqueta: updated.label, personas: updated.people },
        },
      });

      return updated;
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw new DuplicateRateLabelError(input.label ?? "");
    throw error;
  }
}

/** Agrega una fila al final del tarifario de ese tipo de habitación. */
export async function createRate(input: CreateRatePayload, actorEmail: string) {
  try {
    return await prisma.$transaction(async (tx: TxClient) => {
      const roomType = await tx.roomType.findUnique({
        where: { id: input.roomTypeId },
        select: { id: true, name: true },
      });
      if (!roomType) return null;

      const last = await tx.roomRate.findFirst({
        where: { roomTypeId: input.roomTypeId },
        orderBy: { displayOrder: "desc" },
        select: { displayOrder: true },
      });

      const created = await tx.roomRate.create({
        data: {
          roomTypeId: input.roomTypeId,
          label: input.label,
          people: input.people,
          price: input.price,
          displayOrder: (last?.displayOrder ?? 0) + 1,
        },
        select: RATE_SELECT,
      });

      await tx.auditLog.create({
        data: {
          actorEmail,
          action: "CREAR",
          entity: "tarifa_habitacion",
          entityId: String(created.id),
          nextData: {
            habitacion: roomType.name,
            etiqueta: created.label,
            personas: created.people,
            precio: created.price,
          },
        },
      });

      return created;
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw new DuplicateRateLabelError(input.label);
    throw error;
  }
}

export async function deleteRate(rateId: number, actorEmail: string) {
  return prisma.$transaction(async (tx: TxClient) => {
    const rate = await tx.roomRate.findUnique({ where: { id: rateId }, select: RATE_SELECT });
    if (!rate) return null;

    await tx.roomRate.delete({ where: { id: rateId } });

    await tx.auditLog.create({
      data: {
        actorEmail,
        action: "ELIMINAR",
        entity: "tarifa_habitacion",
        entityId: String(rate.id),
        previousData: { etiqueta: rate.label, personas: rate.people, precio: rate.price },
      },
    });

    return rate;
  });
}

/**
 * Sube o baja una fila un lugar dentro de su tipo de habitación. Reescribe el
 * orden completo (1..n) en vez de intercambiar dos valores: así también
 * corrige órdenes repetidos o con huecos que hayan quedado de antes.
 */
export async function moveRate(input: MoveRatePayload, actorEmail: string) {
  return prisma.$transaction(async (tx: TxClient) => {
    const rate = await tx.roomRate.findUnique({
      where: { id: input.rateId },
      select: { id: true, roomTypeId: true, label: true },
    });
    if (!rate) return null;

    const siblings = await tx.roomRate.findMany({
      where: { roomTypeId: rate.roomTypeId },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
      select: { id: true },
    });

    const ids = siblings.map((item) => item.id);
    const from = ids.indexOf(rate.id);
    const to = input.direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= ids.length) return { moved: false };

    [ids[from], ids[to]] = [ids[to], ids[from]];
    for (const [index, id] of ids.entries()) {
      await tx.roomRate.update({ where: { id }, data: { displayOrder: index + 1 } });
    }

    await tx.auditLog.create({
      data: {
        actorEmail,
        action: "ACTUALIZAR",
        entity: "tarifa_habitacion",
        entityId: String(rate.id),
        previousData: { etiqueta: rate.label, posicion: from + 1 },
        nextData: { etiqueta: rate.label, posicion: to + 1 },
      },
    });

    return { moved: true };
  });
}

export async function updateTariffInfo(input: UpdateTariffInfoPayload, actorEmail: string) {
  await ensureTariffBootstrap();

  return prisma.$transaction(async (tx: TxClient) => {
    const current = await tx.tariffInfo.findUnique({
      where: { id: 1 },
      select: {
        id: true,
        parkingNote: true,
        seasonalNote: true,
        validityNote: true,
        extraNotes: true,
      },
    });

    if (!current) {
      return null;
    }

    const updated = await tx.tariffInfo.update({
      where: { id: current.id },
      data: {
        parkingNote: input.parkingNote,
        seasonalNote: input.seasonalNote,
        validityNote: input.validityNote,
        extraNotes: input.extraNotes,
      },
      select: {
        parkingNote: true,
        seasonalNote: true,
        validityNote: true,
        extraNotes: true,
      },
    });

    await tx.auditLog.create({
      data: {
        actorEmail,
        action: "ACTUALIZAR",
        entity: "informacion_tarifas",
        entityId: "1",
        previousData: {
          notaCochera: current.parkingNote,
          notaTemporada: current.seasonalNote,
          notaVigencia: current.validityNote,
          notasAdicionales: normalizeExtraNotes(current.extraNotes),
        },
        nextData: {
          notaCochera: updated.parkingNote,
          notaTemporada: updated.seasonalNote,
          notaVigencia: updated.validityNote,
          notasAdicionales: normalizeExtraNotes(updated.extraNotes),
        },
      },
    });

    return {
      parkingNote: updated.parkingNote,
      seasonalNote: updated.seasonalNote,
      validityNote: updated.validityNote,
      extraNotes: normalizeExtraNotes(updated.extraNotes),
    };
  });
}

export async function getAuditLogs(limit = 100) {
  return prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      actorEmail: true,
      action: true,
      entity: true,
      entityId: true,
      previousData: true,
      nextData: true,
      createdAt: true,
    },
  });
}
