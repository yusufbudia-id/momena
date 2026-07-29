"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/types/action-result";

import * as rsvpRepository from "./repository";
import type { Rsvp } from "./types";
import { rsvpFormSchema } from "./validation";

/**
 * Dipanggil langsung dari halaman publik `/i/[slug]` (guest, tanpa login).
 * `invitationSlug` diteruskan dari client supaya revalidatePath tidak perlu
 * query invitation lagi cuma untuk tahu slug-nya.
 */
export async function submitRsvp(
  invitationId: string,
  invitationSlug: string,
  rawInput: unknown,
): Promise<ActionResult<Rsvp>> {
  const parsed = rsvpFormSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      error: "Data tidak valid",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const rsvp = await rsvpRepository.createRsvp({
      invitationId,
      guestName: parsed.data.guestName,
      phone: parsed.data.phone || null,
      attendeeCount: parsed.data.attendeeCount,
      status: parsed.data.status,
      message: parsed.data.message || null,
    });

    revalidatePath(`/i/${invitationSlug}`);
    revalidatePath(`/invitations/${invitationId}/rsvp`);

    return { success: true, data: rsvp };
  } catch {
    return { success: false, error: "Gagal mengirim RSVP. Coba lagi." };
  }
}
