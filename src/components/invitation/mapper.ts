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
  const events = [...invitation.events].sort((a,b)=>a.order-b.order).map((event)=>({ id:event.id, type:event.type, title:event.title, eventDate:event.eventDate, startTime:event.startTime, endTime:event.endTime, location:event.location, address:event.address, mapsUrl:event.mapsUrl }));
  const primaryEvent = events[0];
  return {
    id: invitation.id,
    slug: invitation.slug,
    title: invitation.title,
    couple:
      invitation.groomName && invitation.brideName
        ? {
            first: invitation.groomName,
            second: invitation.brideName,
            firstParents: invitation.groomParents,
            secondParents: invitation.brideParents,
            firstInstagram: invitation.groomInstagram,
            secondInstagram: invitation.brideInstagram,
          }
        : null,
    tagline: invitation.description
      ? (invitation.description.split("\n")[0] ?? null)
      : null,
    quote: invitation.quote,
    description: invitation.description,
    coverImageUrl: invitation.coverImageUrl,
    coverImagePositionX: invitation.coverImagePositionX,
    coverImagePositionY: invitation.coverImagePositionY,
    groomPhotoUrl: invitation.groomPhotoUrl,
    groomPhotoPositionX: invitation.groomPhotoPositionX,
    groomPhotoPositionY: invitation.groomPhotoPositionY,
    bridePhotoUrl: invitation.bridePhotoUrl,
    bridePhotoPositionX: invitation.bridePhotoPositionX,
    bridePhotoPositionY: invitation.bridePhotoPositionY,
    videoUrl: invitation.videoUrl,
    eventDate: primaryEvent?.eventDate ?? invitation.eventDate,
    eventLocation: primaryEvent?.location ?? invitation.eventLocation,
    eventAddress: primaryEvent?.address ?? invitation.eventAddress,
    eventMapsUrl: primaryEvent?.mapsUrl ?? invitation.eventMapsUrl,
    events,
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
        qrImageUrl: gift.qrImageUrl,
      })),
    story: [...invitation.stories]
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        id: item.id,
        title: item.title,
        date: item.date,
        description: item.description,
      })),
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
    settings: {
      showGallery: invitation.settings?.showGallery ?? true,
      showRsvp: invitation.settings?.showRsvp ?? true,
      showGift: invitation.settings?.showGift ?? true,
      showStory: invitation.settings?.showStory ?? true,
      showVideo: invitation.settings?.showVideo ?? true,
      templateVariant: invitation.settings?.templateVariant ?? null,
      accentColor: invitation.settings?.accentColor ?? null,
      fontFamily: invitation.settings?.fontFamily ?? "default",
      heroLayout: invitation.settings?.heroLayout ?? "default",
      decorationLevel: invitation.settings?.decorationLevel ?? "medium",
    },
    musicUrl: invitation.settings?.musicUrl ?? null,
  };
}
