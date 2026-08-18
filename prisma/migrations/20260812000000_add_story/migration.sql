-- Ditulis manual seperti migration sebelumnya (engine Prisma tidak bisa
-- diakses dari sandbox). Jalankan `npx prisma migrate dev` di environment
-- kamu untuk migration resmi & tervalidasi.

-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stories_invitationId_idx" ON "stories"("invitationId");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
