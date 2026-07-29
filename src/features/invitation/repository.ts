import { db } from "@/lib/db";

import type {
  CreateInvitationInput,
  GalleryItemInput,
  GiftItemInput,
  Invitation,
  InvitationListItem,
  InvitationStats,
  InvitationWithRelations,
  PaginatedResult,
  UpdateInvitationInput,
} from "./types";

/**
 * Repository layer untuk Invitation.
 * Semua akses `prisma.invitation.*` (dan relasi Gallery/Gift-nya) HARUS
 * lewat sini — jangan panggil `db.invitation` langsung dari action/component.
 */

export async function getInvitationById(
  id: string,
): Promise<InvitationWithRelations | null> {
  return db.invitation.findUnique({
    where: { id },
    include: { template: true, gallery: true, rsvps: true, gifts: true, settings: true },
  });
}

export async function getInvitationBySlug(
  slug: string,
): Promise<InvitationWithRelations | null> {
  return db.invitation.findUnique({
    where: { slug },
    include: { template: true, gallery: true, rsvps: true, gifts: true, settings: true },
  });
}

export async function getInvitationsByUserId(userId: string): Promise<Invitation[]> {
  return db.invitation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/** Invitation List: pagination + pencarian judul, diurutkan terbaru dulu. */
export async function getInvitationsPage(params: {
  userId: string;
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PaginatedResult<InvitationListItem>> {
  const { userId, page, pageSize, search } = params;

  const where = {
    userId,
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [data, total] = await Promise.all([
    db.invitation.findMany({
      where,
      include: { template: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.invitation.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Statistik untuk kartu di Dashboard Home. */
export async function getInvitationStats(userId: string): Promise<InvitationStats> {
  const [total, published, draft, archived] = await Promise.all([
    db.invitation.count({ where: { userId } }),
    db.invitation.count({ where: { userId, status: "PUBLISHED" } }),
    db.invitation.count({ where: { userId, status: "DRAFT" } }),
    db.invitation.count({ where: { userId, status: "ARCHIVED" } }),
  ]);

  return { total, published, draft, archived };
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await db.invitation.findUnique({
    where: { slug },
    select: { id: true },
  });
  return existing !== null && existing.id !== excludeId;
}

function toGalleryCreateData(gallery: GalleryItemInput[]) {
  return gallery.map((item, index) => ({ ...item, order: index }));
}

function toGiftCreateData(gifts: GiftItemInput[]) {
  return gifts.map((item, index) => ({ ...item, order: index }));
}

/** Membuat invitation beserta gallery & gift-nya dalam satu operasi. */
export async function createInvitation(
  input: CreateInvitationInput,
): Promise<Invitation> {
  const { gallery = [], gifts = [], ...invitationData } = input;

  return db.invitation.create({
    data: {
      ...invitationData,
      settings: { create: {} }, // Settings dibuat otomatis dengan default
      gallery: { create: toGalleryCreateData(gallery) },
      gifts: { create: toGiftCreateData(gifts) },
    },
  });
}

/**
 * Update invitation. Kalau `gallery`/`gifts` dikirim, seluruh baris lama
 * diganti dengan yang baru (replace-all) — cukup untuk semantik "simpan
 * form wizard", tidak perlu diff per-item.
 */
export async function updateInvitation(
  id: string,
  input: UpdateInvitationInput,
): Promise<Invitation> {
  const { gallery, gifts, ...invitationData } = input;

  return db.$transaction(async (tx) => {
    if (gallery) {
      await tx.gallery.deleteMany({ where: { invitationId: id } });
      if (gallery.length > 0) {
        await tx.gallery.createMany({
          data: toGalleryCreateData(gallery).map((item) => ({
            ...item,
            invitationId: id,
          })),
        });
      }
    }

    if (gifts) {
      await tx.gift.deleteMany({ where: { invitationId: id } });
      if (gifts.length > 0) {
        await tx.gift.createMany({
          data: toGiftCreateData(gifts).map((item) => ({
            ...item,
            invitationId: id,
          })),
        });
      }
    }

    return tx.invitation.update({ where: { id }, data: invitationData });
  });
}

export async function deleteInvitation(id: string): Promise<Invitation> {
  return db.invitation.delete({ where: { id } });
}

export async function publishInvitation(id: string): Promise<Invitation> {
  return db.invitation.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}

export async function archiveInvitation(id: string): Promise<Invitation> {
  return db.invitation.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
}
