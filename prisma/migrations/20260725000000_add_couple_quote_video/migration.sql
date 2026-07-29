-- Catatan: sama seperti migration init, ditulis manual (engine Prisma
-- tidak bisa diakses dari sandbox). Jalankan `npx prisma migrate dev`
-- di environment kamu untuk migration resmi & tervalidasi.

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN "groomName" TEXT;
ALTER TABLE "invitations" ADD COLUMN "brideName" TEXT;
ALTER TABLE "invitations" ADD COLUMN "quote" TEXT;
ALTER TABLE "invitations" ADD COLUMN "videoUrl" TEXT;
