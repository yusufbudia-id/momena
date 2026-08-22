import { deleteImages } from "@/features/media/cloudinary";
import { db } from "@/lib/db";

import type {
  CreateInvitationInput,
  EventItemInput,
  GalleryItemInput,
  GiftItemInput,
  Invitation,
  InvitationListItem,
  InvitationStats,
  InvitationWithRelations,
  PaginatedResult,
  StoryItemInput,
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
    include: {
      template: true,
      gallery: true,
      rsvps: true,
      gifts: true,
      settings: true,
      stories: true,
      events: true,
    },
  });
}

export async function getInvitationBySlug(
  slug: string,
): Promise<InvitationWithRelations | null> {
  return db.invitation.findUnique({
    where: { slug },
    include: {
      template: true,
      gallery: true,
      rsvps: true,
      gifts: true,
      settings: true,
      stories: true,
      events: true,
    },
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

function toEventCreateData(events: EventItemInput[]) {
  return events.map((item, index) => ({ ...item, type: item.type || "OTHER", order: index }));
}

function toGalleryCreateData(gallery: GalleryItemInput[]) {
  return gallery.map((item, index) => ({ ...item, order: index }));
}

function toGiftCreateData(gifts: GiftItemInput[]) {
  return gifts.map((item, index) => ({ ...item, order: index }));
}

function toStoryCreateData(stories: StoryItemInput[]) {
  return stories.map((item, index) => ({ ...item, order: index }));
}

/** Membuat invitation beserta gallery, gift, & story-nya dalam satu operasi. */
export async function createInvitation(
  input: CreateInvitationInput,
): Promise<Invitation> {
  const { settings, events = [], gallery = [], gifts = [], stories = [], ...invitationData } = input;
  const primaryEvent = events[0];

  return db.invitation.create({
    data: {
      ...invitationData,
      eventDate: primaryEvent?.eventDate ?? invitationData.eventDate ?? null,
      eventLocation: primaryEvent?.location ?? invitationData.eventLocation ?? null,
      eventAddress: primaryEvent?.address ?? invitationData.eventAddress ?? null,
      eventMapsUrl: primaryEvent?.mapsUrl ?? invitationData.eventMapsUrl ?? null,
      settings: { create: settings ?? {} },
      events: { create: toEventCreateData(events) },
      gallery: { create: toGalleryCreateData(gallery) },
      gifts: { create: toGiftCreateData(gifts) },
      stories: { create: toStoryCreateData(stories) },
    },
  });
}

/**
 * Update invitation. Kalau `gallery`/`gifts`/`stories` dikirim, seluruh
 * baris lama diganti dengan yang baru (replace-all) — cukup untuk semantik
 * "simpan form wizard", tidak perlu diff per-item.
 */
export async function updateInvitation(
  id: string,
  input: UpdateInvitationInput,
): Promise<Invitation> {
  const existing = await db.invitation.findUnique({
    where: { id },
    select: {
      coverImagePublicId: true,
      groomPhotoPublicId: true,
      bridePhotoPublicId: true,
      gallery: { select: { imagePublicId: true } },
      gifts: { select: { qrImagePublicId: true } },
    },
  });

  const { settings, events, gallery, gifts, stories, ...invitationData } = input;
  if (events) {
    const primaryEvent = events[0];
    invitationData.eventDate = primaryEvent?.eventDate ?? null;
    invitationData.eventLocation = primaryEvent?.location ?? null;
    invitationData.eventAddress = primaryEvent?.address ?? null;
    invitationData.eventMapsUrl = primaryEvent?.mapsUrl ?? null;
  }

  const updated = await db.$transaction(async (tx) => {
    if (settings) {
      await tx.settings.upsert({
        where: { invitationId: id },
        create: { invitationId: id, ...settings },
        update: settings,
      });
    }

    if (events) {
      await tx.invitationEvent.deleteMany({ where: { invitationId: id } });
      if (events.length > 0) {
        await tx.invitationEvent.createMany({ data: toEventCreateData(events).map((item) => ({ ...item, invitationId: id })) });
      }
    }

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

    if (stories) {
      await tx.story.deleteMany({ where: { invitationId: id } });
      if (stories.length > 0) {
        await tx.story.createMany({
          data: toStoryCreateData(stories).map((item) => ({
            ...item,
            invitationId: id,
          })),
        });
      }
    }

    return tx.invitation.update({ where: { id }, data: invitationData });
  });

  if (existing) {
    const stalePublicIds: Array<string | null | undefined> = [];
    const has = (key: keyof UpdateInvitationInput) =>
      Object.prototype.hasOwnProperty.call(input, key);

    if (has("coverImagePublicId") && existing.coverImagePublicId !== input.coverImagePublicId) {
      stalePublicIds.push(existing.coverImagePublicId);
    }
    if (has("groomPhotoPublicId") && existing.groomPhotoPublicId !== input.groomPhotoPublicId) {
      stalePublicIds.push(existing.groomPhotoPublicId);
    }
    if (has("bridePhotoPublicId") && existing.bridePhotoPublicId !== input.bridePhotoPublicId) {
      stalePublicIds.push(existing.bridePhotoPublicId);
    }

    if (gallery) {
      const nextIds = new Set(gallery.map((item) => item.imagePublicId).filter(Boolean));
      for (const item of existing.gallery) {
        if (item.imagePublicId && !nextIds.has(item.imagePublicId)) stalePublicIds.push(item.imagePublicId);
      }
    }
    if (gifts) {
      const nextIds = new Set(gifts.map((item) => item.qrImagePublicId).filter(Boolean));
      for (const item of existing.gifts) {
        if (item.qrImagePublicId && !nextIds.has(item.qrImagePublicId)) stalePublicIds.push(item.qrImagePublicId);
      }
    }

    await deleteImages(stalePublicIds);
  }

  return updated;
}

export async function deleteInvitation(id: string): Promise<Invitation> {
  const existing = await db.invitation.findUnique({
    where: { id },
    select: {
      coverImagePublicId: true,
      groomPhotoPublicId: true,
      bridePhotoPublicId: true,
      gallery: { select: { imagePublicId: true } },
      gifts: { select: { qrImagePublicId: true } },
    },
  });

  const deleted = await db.invitation.delete({ where: { id } });

  if (existing) {
    await deleteImages([
      existing.coverImagePublicId,
      existing.groomPhotoPublicId,
      existing.bridePhotoPublicId,
      ...existing.gallery.map((item) => item.imagePublicId),
      ...existing.gifts.map((item) => item.qrImagePublicId),
    ]);
  }

  return deleted;
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
