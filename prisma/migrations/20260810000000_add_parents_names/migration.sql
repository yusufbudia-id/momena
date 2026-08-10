-- Ditulis manual seperti migration sebelumnya (engine Prisma tidak bisa
-- diakses dari sandbox). Jalankan `npx prisma migrate dev` di environment
-- kamu untuk migration resmi & tervalidasi.

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN "groomParents" TEXT;
ALTER TABLE "invitations" ADD COLUMN "brideParents" TEXT;
