-- CATATAN: file ini ditulis manual mengikuti format standar output Prisma,
-- BUKAN hasil `prisma migrate dev` resmi (engine Prisma tidak bisa diakses
-- dari sandbox ini). Jalankan `npx prisma migrate dev --name init` di
-- environment kamu untuk migration resmi & tervalidasi; file ini hanya
-- draft/fallback kalau kamu mau apply SQL-nya langsung ke Supabase.

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('ATTENDING', 'NOT_ATTENDING', 'MAYBE');

-- CreateEnum
CREATE TYPE "GiftMethod" AS ENUM ('BANK_TRANSFER', 'E_WALLET');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "previewUrl" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "eventLocation" TEXT,
    "eventAddress" TEXT,
    "eventMapsUrl" TEXT,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "phone" TEXT,
    "attendeeCount" INTEGER NOT NULL DEFAULT 1,
    "status" "RsvpStatus" NOT NULL DEFAULT 'ATTENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gifts" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "method" "GiftMethod" NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountHolder" TEXT,
    "ewalletName" TEXT,
    "ewalletNumber" TEXT,
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "showGallery" BOOLEAN NOT NULL DEFAULT true,
    "showRsvp" BOOLEAN NOT NULL DEFAULT true,
    "showGift" BOOLEAN NOT NULL DEFAULT true,
    "musicUrl" TEXT,
    "isPasswordProtected" BOOLEAN NOT NULL DEFAULT false,
    "accessCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "templates_slug_key" ON "templates"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_slug_key" ON "invitations"("slug");

-- CreateIndex
CREATE INDEX "invitations_userId_idx" ON "invitations"("userId");

-- CreateIndex
CREATE INDEX "galleries_invitationId_idx" ON "galleries"("invitationId");

-- CreateIndex
CREATE INDEX "rsvps_invitationId_idx" ON "rsvps"("invitationId");

-- CreateIndex
CREATE INDEX "gifts_invitationId_idx" ON "gifts"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_invitationId_key" ON "settings"("invitationId");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
