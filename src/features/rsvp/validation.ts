import { z } from "zod";

export const rsvpFormSchema = z.object({
  guestName: z.string().min(2, "Nama minimal 2 karakter").max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  attendeeCount: z.coerce
    .number()
    .int()
    .min(1, "Minimal 1 orang")
    .max(20, "Maksimal 20 orang"),
  status: z.enum(["ATTENDING", "NOT_ATTENDING", "MAYBE"], {
    errorMap: () => ({ message: "Pilih salah satu kehadiran" }),
  }),
  message: z
    .string()
    .max(500, "Ucapan maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
});

export type RsvpFormValues = z.infer<typeof rsvpFormSchema>;
