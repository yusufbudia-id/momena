import { z } from "zod";

/**
 * Validasi environment variable saat aplikasi start.
 * Tambahkan key baru di sini setiap kali menambah env var baru,
 * supaya error muncul di build/boot time, bukan runtime saat fitur dipakai.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
