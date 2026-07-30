import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Prisma CLI (migrate/db seed) butuh koneksi LANGSUNG (bukan lewat
    // pgbouncer) — makanya DIRECT_URL di sini, bukan DATABASE_URL.
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
