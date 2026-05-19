import bcrypt from "bcryptjs";
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
      { label: "Single / Doble", people: 2, price: 59000, displayOrder: 1 },
      { label: "Triple", people: 3, price: 69000, displayOrder: 2 },
      { label: "Cuádruple", people: 4, price: 78000, displayOrder: 3 },
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
      { label: "Triple", people: 3, price: 75000, displayOrder: 1 },
      { label: "Cuádruple", people: 4, price: 88000, displayOrder: 2 },
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

const UPDATE_RATE_SCHEMA = z.object({
  roomTypeId: z.int().positive(),
  rateId: z.int().positive(),
  price: z.int().positive().max(999999999),
});

const UPDATE_TARIFF_INFO_SCHEMA = z.object({
  parkingNote: z.string().trim().min(5).max(220),
  seasonalNote: z.string().trim().min(5).max(320),
  validityNote: z.string().trim().min(5).max(220),
  extraNotes: z.array(z.string().trim().min(5).max(220)).max(8).default([]),
});

type TxClient = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">;

export type UpdateRatePayload = z.infer<typeof UPDATE_RATE_SCHEMA>;
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

export async function getRoomTypesWithRates() {
  return prisma.roomType.findMany({
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      code: true,
      name: true,
      badge: true,
      description: true,
      rates: {
        orderBy: { displayOrder: "asc" },
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
  await ensureTariffBootstrap();
  return findTariffInfo();
}

export async function getTariffCatalog() {
  await ensureTariffBootstrap();

  const [roomTypes, tariffInfo] = await Promise.all([
    getRoomTypesWithRates(),
    findTariffInfo(),
  ]);

  return { roomTypes, tariffInfo };
}

export async function updateRatePrice(input: UpdateRatePayload, actorEmail: string) {
  return prisma.$transaction(async (tx: TxClient) => {
    const rate = await tx.roomRate.findUnique({
      where: { id: input.rateId },
      select: {
        id: true,
        price: true,
        roomTypeId: true,
        label: true,
      },
    });

    if (!rate || rate.roomTypeId !== input.roomTypeId) {
      return null;
    }

    const updated = await tx.roomRate.update({
      where: { id: input.rateId },
      data: { price: input.price },
      select: {
        id: true,
        roomTypeId: true,
        label: true,
        people: true,
        price: true,
      },
    });

    await tx.auditLog.create({
      data: {
        actorEmail,
        action: "ACTUALIZAR",
        entity: "tarifa_habitacion",
        entityId: String(updated.id),
        previousData: { precio: rate.price, etiqueta: rate.label },
        nextData: { precio: updated.price, etiqueta: updated.label },
      },
    });

    return updated;
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
