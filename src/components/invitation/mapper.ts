import type { InvitationWithRelations } from "@/features/invitation/types";

import type { InvitationViewModel } from "./view-model";

/**
 * Mengubah data Prisma (`InvitationWithRelations`) jadi `InvitationViewModel`.
 * Ini satu-satunya tempat yang boleh tahu bentuk tabel database untuk
 * keperluan render publik — section & template tidak pernah import
 * `@prisma/client` atau tipe dari `features/invitation`.
 */
export function toInvitationViewModel(
  invitation: InvitationWithRelations,
): InvitationViewModel {
  return {
    id: invitation.id,
    slug: invitation.slug,
    title: invitation.title,
    couple:
      invitation.groomName && invitation.brideName
        ? { first: invitation.groomName, second: invitation.brideName }
        : null,
    tagline: invitation.description
      ? (invitation.description.split("\n")[0] ?? null)
      : null,
    quote: invitation.quote,
    description: invitation.description,
    coverImageUrl: invitation.coverImageUrl,
    videoUrl: invitation.videoUrl,
    eventDate: invitation.eventDate,
    eventLocation: invitation.eventLocation,
    eventAddress: invitation.eventAddress,
    eventMapsUrl: invitation.eventMapsUrl,
    gallery: [...invitation.gallery]
      .sort((a, b) => a.order - b.order)
      .map((photo) => ({
        id: photo.id,
        imageUrl: photo.imageUrl,
        caption: photo.caption,
      })),
    gifts: [...invitation.gifts]
      .sort((a, b) => a.order - b.order)
      .map((gift) => ({
        id: gift.id,
        label: (gift.method === "BANK_TRANSFER" ? gift.bankName : gift.ewalletName) ?? "",
        number: gift.method === "BANK_TRANSFER" ? gift.accountNumber : gift.ewalletNumber,
        holderName: gift.method === "BANK_TRANSFER" ? gift.accountHolder : null,
        note: gift.note,
      })),
    // TODO: belum ada tabel Story di database — selalu kosong untuk sekarang.
    // Begitu ada, tinggal query di sini, section LoveStory/Timeline tidak berubah.
    story: [],
    guestBook: [...invitation.rsvps]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((rsvp) => ({
        id: rsvp.id,
        guestName: rsvp.guestName,
        attendeeCount: rsvp.attendeeCount,
        status: rsvp.status,
        message: rsvp.message,
        createdAt: rsvp.createdAt,
      })),
    templateSlug: invitation.template.slug,
  };
}
