import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está configurada para el seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(databaseUrl),
});

const DEFAULT_ROOM_TYPES = [
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

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password || password.length < 8) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
}

async function seedTariffs() {
  for (const roomType of DEFAULT_ROOM_TYPES) {
    const created = await prisma.roomType.upsert({
      where: { code: roomType.code },
      update: {
        name: roomType.name,
        badge: roomType.badge,
        description: roomType.description,
        displayOrder: roomType.displayOrder,
      },
      create: {
        code: roomType.code,
        name: roomType.name,
        badge: roomType.badge,
        description: roomType.description,
        displayOrder: roomType.displayOrder,
      },
    });

    for (const rate of roomType.rates) {
      await prisma.roomRate.upsert({
        where: {
          roomTypeId_label: {
            roomTypeId: created.id,
            label: rate.label,
          },
        },
        update: {
          people: rate.people,
          price: rate.price,
          displayOrder: rate.displayOrder,
        },
        create: {
          roomTypeId: created.id,
          label: rate.label,
          people: rate.people,
          price: rate.price,
          displayOrder: rate.displayOrder,
        },
      });
    }
  }
}

async function main() {
  await seedAdmin();
  await seedTariffs();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
