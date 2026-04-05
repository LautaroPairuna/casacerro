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

const UPDATE_RATE_SCHEMA = z.object({
  roomTypeId: z.int().positive(),
  rateId: z.int().positive(),
  price: z.int().positive().max(999999999),
});

export type UpdateRatePayload = z.infer<typeof UPDATE_RATE_SCHEMA>;

export function parseUpdateRatePayload(input: unknown): UpdateRatePayload {
  return UPDATE_RATE_SCHEMA.parse(input);
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
    select: { id: true },
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
  }
}

export async function ensureTariffBootstrap(): Promise<void> {
  const existing = await prisma.roomType.count();
  if (existing > 0) return;

  await prisma.$transaction(async (tx) => {
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

export async function updateRatePrice(input: UpdateRatePayload, actorEmail: string) {
  return prisma.$transaction(async (tx) => {
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
