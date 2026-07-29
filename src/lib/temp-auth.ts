import { db } from "@/lib/db";

/**
 * Pengganti sementara session Auth.js.
 * Mengambil user admin yang dibuat di `prisma/seed.ts` (email tetap:
 * admin@momena.id) sebagai "user yang sedang login".
 *
 * Begitu Auth.js terpasang: hapus file ini, ganti semua pemanggilnya
 * dengan `auth()` / session asli.
 */
export async function getCurrentUserId(): Promise<string> {
  const user = await db.user.findUniqueOrThrow({
    where: { email: "admin@momena.id" },
    select: { id: true },
  });
  return user.id;
}
