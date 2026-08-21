import { z } from "zod";

/**
 * Schema dasar field invitation yang boleh diisi user.
 * userId, id, timestamps, dan status sengaja tidak masuk sini —
 * itu diatur oleh server (repository/action), bukan input user.
 */
const invitationBaseSchema = {
  templateId: z.string().min(1, "Template wajib dipilih"),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .max(60, "Slug maksimal 60 karakter")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda strip",
    ),
  title: z.string().min(3, "Judul minimal 3 karakter").max(150),
  groomName: z.string().max(100).optional().nullable(),
  brideName: z.string().max(100).optional().nullable(),
  groomParents: z.string().max(150).optional().nullable(),
  brideParents: z.string().max(150).optional().nullable(),
  groomInstagram: z
    .string()
    .max(50)
    .regex(/^[a-zA-Z0-9._]*$/, "Tanpa @ atau spasi, cuma huruf/angka/titik/underscore")
    .optional()
    .nullable()
    .or(z.literal("")),
  brideInstagram: z
    .string()
    .max(50)
    .regex(/^[a-zA-Z0-9._]*$/, "Tanpa @ atau spasi, cuma huruf/angka/titik/underscore")
    .optional()
    .nullable()
    .or(z.literal("")),
  eventDate: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.date().optional().nullable(),
  ),
  eventLocation: z.string().max(150).optional().nullable(),
  eventAddress: z.string().max(255).optional().nullable(),
  eventMapsUrl: z
    .string()
    .url("URL Maps tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
  description: z.string().max(2000).optional().nullable(),
  coverImageUrl: z
    .string()
    .url("URL cover tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
  coverImagePublicId: z.string().max(255).optional().nullable().or(z.literal("")),
  groomPhotoUrl: z.string().url("URL foto mempelai pria tidak valid").optional().nullable().or(z.literal("")),
  groomPhotoPublicId: z.string().max(255).optional().nullable().or(z.literal("")),
  bridePhotoUrl: z.string().url("URL foto mempelai wanita tidak valid").optional().nullable().or(z.literal("")),
  bridePhotoPublicId: z.string().max(255).optional().nullable().or(z.literal("")),
  quote: z.string().max(500).optional().nullable(),
  videoUrl: z
    .string()
    .url("URL video tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
};

export const galleryItemSchema = z.object({
  imageUrl: z.string().url("URL foto tidak valid"),
  imagePublicId: z.string().max(255).optional().nullable().or(z.literal("")),
  caption: z.string().max(150).optional().nullable(),
});

export const storyItemSchema = z.object({
  title: z.string().min(1, "Judul momen wajib diisi").max(100),
  date: z.string().max(50).optional().nullable(),
  description: z.string().min(1, "Cerita wajib diisi").max(500),
});

export const giftItemSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("BANK_TRANSFER"),
    bankName: z.string().min(1, "Nama bank wajib diisi"),
    accountNumber: z.string().min(1, "Nomor rekening wajib diisi"),
    accountHolder: z.string().min(1, "Nama pemilik rekening wajib diisi"),
    note: z.string().max(150).optional().nullable(),
  }),
  z.object({
    method: z.literal("E_WALLET"),
    ewalletName: z.string().min(1, "Nama e-wallet wajib diisi"),
    ewalletNumber: z.string().min(1, "Nomor e-wallet wajib diisi"),
    note: z.string().max(150).optional().nullable(),
  }),
]);

export const createInvitationSchema = z.object(invitationBaseSchema);
export const updateInvitationSchema = z.object(invitationBaseSchema).partial();

/** Schema penuh yang dipakai wizard Create/Edit (Event + Gallery + Gift + Story). */
export const invitationWizardSchema = z.object({
  ...invitationBaseSchema,
  gallery: z.array(galleryItemSchema).max(20).default([]),
  gifts: z.array(giftItemSchema).max(10).default([]),
  stories: z.array(storyItemSchema).max(20).default([]),
});

/**
 * Schema untuk form di client (dipakai `useForm` + `zodResolver`).
 * Bedanya cuma `eventDate`: di sini string mentah dari `<input type="date">`,
 * di server (`invitationWizardSchema`) baru di-coerce jadi `Date`.
 */
export const invitationWizardFormSchema = z.object({
  templateId: invitationBaseSchema.templateId,
  slug: invitationBaseSchema.slug,
  title: invitationBaseSchema.title,
  groomName: invitationBaseSchema.groomName,
  brideName: invitationBaseSchema.brideName,
  groomParents: invitationBaseSchema.groomParents,
  brideParents: invitationBaseSchema.brideParents,
  groomInstagram: invitationBaseSchema.groomInstagram,
  brideInstagram: invitationBaseSchema.brideInstagram,
  eventDate: z.string().optional().nullable(),
  eventLocation: invitationBaseSchema.eventLocation,
  eventAddress: invitationBaseSchema.eventAddress,
  eventMapsUrl: invitationBaseSchema.eventMapsUrl,
  description: invitationBaseSchema.description,
  coverImageUrl: invitationBaseSchema.coverImageUrl,
  coverImagePublicId: invitationBaseSchema.coverImagePublicId,
  groomPhotoUrl: invitationBaseSchema.groomPhotoUrl,
  groomPhotoPublicId: invitationBaseSchema.groomPhotoPublicId,
  bridePhotoUrl: invitationBaseSchema.bridePhotoUrl,
  bridePhotoPublicId: invitationBaseSchema.bridePhotoPublicId,
  quote: invitationBaseSchema.quote,
  videoUrl: invitationBaseSchema.videoUrl,
  gallery: z.array(galleryItemSchema).max(20).default([]),
  gifts: z.array(giftItemSchema).max(10).default([]),
  stories: z.array(storyItemSchema).max(20).default([]),
});

export type CreateInvitationSchema = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationSchema = z.infer<typeof updateInvitationSchema>;
export type InvitationWizardSchema = z.infer<typeof invitationWizardSchema>;
export type InvitationWizardFormValues = z.infer<typeof invitationWizardFormSchema>;
export type GalleryItemSchema = z.infer<typeof galleryItemSchema>;
export type StoryItemSchema = z.infer<typeof storyItemSchema>;
export type GiftItemSchema = z.infer<typeof giftItemSchema>;
