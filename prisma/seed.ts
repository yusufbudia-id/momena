import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const passwordHash = await bcrypt.hash("admin12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@momena.id" },
    update: {},
    create: {
      name: "Admin Momena",
      email: "admin@momena.id",
      password: passwordHash,
    },
  });

  console.log(`Seeded admin: ${admin.email}`);
  return admin;
}

async function seedTemplates() {
  const templates = [
    {
      name: "Elegant",
      slug: "elegant",
      thumbnailUrl: "/templates/elegant/thumbnail.jpg",
      previewUrl: "/templates/elegant/preview",
      isPremium: false,
    },
    {
      name: "Minimal",
      slug: "minimal",
      thumbnailUrl: "/templates/minimal/thumbnail.jpg",
      previewUrl: "/templates/minimal/preview",
      isPremium: false,
    },
    {
      name: "Modern",
      slug: "modern",
      thumbnailUrl: "/templates/modern/thumbnail.jpg",
      previewUrl: "/templates/modern/preview",
      isPremium: false,
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: {},
      create: template,
    });
  }

  console.log(`Seeded ${templates.length} templates`);
}

async function main() {
  await seedAdmin();
  await seedTemplates();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
