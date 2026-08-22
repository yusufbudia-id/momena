import type { Gallery, Gift, GiftMethod, Invitation, InvitationEvent, InvitationStatus, Prisma, Story } from "@prisma/client";
export type { Invitation, InvitationStatus, InvitationEvent, Gallery, Gift, GiftMethod, Story };
export type InvitationWithRelations = Prisma.InvitationGetPayload<{ include: { template: true; gallery: true; rsvps: true; gifts: true; settings: true; stories: true; events: true } }>;
export type InvitationListItem = Prisma.InvitationGetPayload<{ include: { template: true } }>;
export type GalleryItemInput = { imageUrl: string; imagePublicId?: string | null; caption?: string | null };
export type StoryItemInput = { title: string; date?: string | null; description: string };
export type EventItemInput = { type?: string | null; title: string; eventDate?: Date | null; startTime?: string | null; endTime?: string | null; location?: string | null; address?: string | null; mapsUrl?: string | null };
export type GiftItemInput = { method: GiftMethod; bankName?: string | null; accountNumber?: string | null; accountHolder?: string | null; ewalletName?: string | null; ewalletNumber?: string | null; note?: string | null; qrImageUrl?: string | null; qrImagePublicId?: string | null };
export type InvitationSettingsInput = { showGallery?: boolean; showRsvp?: boolean; showGift?: boolean; showStory?: boolean; showVideo?: boolean; musicUrl?: string | null; templateVariant?: string | null; accentColor?: string | null; fontFamily?: string | null; heroLayout?: string | null; decorationLevel?: string | null };
export type CreateInvitationInput = {
 userId: string; templateId: string; slug: string; title: string; groomName?: string | null; brideName?: string | null; groomParents?: string | null; brideParents?: string | null; groomInstagram?: string | null; brideInstagram?: string | null; eventDate?: Date | null; eventLocation?: string | null; eventAddress?: string | null; eventMapsUrl?: string | null; description?: string | null; coverImageUrl?: string | null; coverImagePublicId?: string | null; coverImagePositionX?: number; coverImagePositionY?: number; groomPhotoUrl?: string | null; groomPhotoPublicId?: string | null; groomPhotoPositionX?: number; groomPhotoPositionY?: number; bridePhotoUrl?: string | null; bridePhotoPublicId?: string | null; bridePhotoPositionX?: number; bridePhotoPositionY?: number; quote?: string | null; videoUrl?: string | null; settings?: InvitationSettingsInput; events?: EventItemInput[]; gallery?: GalleryItemInput[]; gifts?: GiftItemInput[]; stories?: StoryItemInput[];
};
export type UpdateInvitationInput = Partial<Omit<CreateInvitationInput, "userId">>;
export type InvitationStats = { total: number; published: number; draft: number; archived: number };
export type PaginatedResult<T> = { data: T[]; total: number; page: number; pageSize: number; pageCount: number };
