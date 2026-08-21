export interface CoupleNames {
  first: string;
  second: string;
  firstParents: string | null;
  secondParents: string | null;
  firstInstagram: string | null;
  secondInstagram: string | null;
}

export interface GalleryPhotoView {
  id: string;
  imageUrl: string;
  caption: string | null;
}

export interface InvitationEventView {
  id: string; type: string; title: string; eventDate: Date | null; startTime: string | null; endTime: string | null; location: string | null; address: string | null; mapsUrl: string | null;
}

export interface GiftMethodView {
  id: string;
  label: string; // nama bank / nama e-wallet
  number: string | null;
  holderName: string | null; // hanya terisi untuk transfer bank
  note: string | null;
}

/** Belum ada sumber data — selalu array kosong sampai schema Story dibuat. */
export interface StoryItemView {
  id: string;
  title: string;
  date: string | null;
  description: string;
}

export type AttendanceStatus = "ATTENDING" | "NOT_ATTENDING" | "MAYBE";

export interface GuestBookEntryView {
  id: string;
  guestName: string;
  attendeeCount: number;
  status: AttendanceStatus;
  message: string | null;
  createdAt: Date;
}

/**
 * Kontrak data yang dilihat section & template. Sengaja TIDAK sama persis
 * dengan bentuk tabel Prisma — supaya kalau schema database berubah
 * (mis. Participants[] di v2), yang berubah cukup `mapper.ts`, section dan
 * template tidak disentuh sama sekali.
 */
export interface InvitationViewModel {
  id: string;
  slug: string;
  title: string;
  couple: CoupleNames | null;
  tagline: string | null;
  quote: string | null;
  description: string | null;
  coverImageUrl: string | null;
  coverImagePositionX: number;
  coverImagePositionY: number;
  groomPhotoUrl: string | null;
  groomPhotoPositionX: number;
  groomPhotoPositionY: number;
  bridePhotoUrl: string | null;
  bridePhotoPositionX: number;
  bridePhotoPositionY: number;
  videoUrl: string | null;
  eventDate: Date | null;
  eventLocation: string | null;
  eventAddress: string | null;
  eventMapsUrl: string | null;
  events: InvitationEventView[];
  gallery: GalleryPhotoView[];
  gifts: GiftMethodView[];
  story: StoryItemView[];
  guestBook: GuestBookEntryView[];
  templateSlug: string;
  /** Dari Settings.musicUrl — null kalau belum diisi (belum ada UI edit Settings). */
  musicUrl: string | null;
  /**
   * True hanya untuk `demoInvitationViewModel` (dipakai halaman preview
   * template). Section yang melakukan write (mis. Rsvp) HARUS cek ini dan
   * tidak benar-benar mengirim data — invitation "demo" tidak ada di
   * database, submit sungguhan akan gagal (foreign key violation).
   */
  isPreview?: boolean;
}
