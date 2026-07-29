"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/types/action-result";

import * as invitationRepository from "./repository";
import type { Invitation } from "./types";
import { invitationWizardSchema, updateInvitationSchema } from "./validation";

// TODO: ganti parameter `userId` dengan session Auth.js begitu auth siap.
// Untuk sekarang userId masih diterima manual dari pemanggil
// (lihat src/lib/temp-auth.ts).

export async function createInvitation(
  userId: string,
  rawInput: unknown,
): Promise<ActionResult<Invitation>> {
  const parsed = invitationWizardSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      error: "Data tidak valid",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const slugTaken = await invitationRepository.isSlugTaken(parsed.data.slug);
  if (slugTaken) {
    return {
      success: false,
      error: "Slug sudah dipakai, coba yang lain",
      fieldErrors: { slug: ["Slug sudah dipakai"] },
    };
  }

  try {
    const invitation = await invitationRepository.createInvitation({
      ...parsed.data,
      userId,
    });

    revalidatePath("/dashboard");
    revalidatePath("/invitations");
    return { success: true, data: invitation };
  } catch {
    return { success: false, error: "Gagal membuat invitation" };
  }
}

export async function updateInvitation(
  id: string,
  rawInput: unknown,
): Promise<ActionResult<Invitation>> {
  // Update dari wizard membawa gallery/gifts, dari form parsial tidak — coba
  // wizard schema dulu, jatuh ke schema partial biasa kalau tidak cocok.
  const wizardParsed = invitationWizardSchema.partial().safeParse(rawInput);
  const parsed = wizardParsed.success
    ? wizardParsed
    : updateInvitationSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      error: "Data tidak valid",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.slug) {
    const slugTaken = await invitationRepository.isSlugTaken(parsed.data.slug, id);
    if (slugTaken) {
      return {
        success: false,
        error: "Slug sudah dipakai, coba yang lain",
        fieldErrors: { slug: ["Slug sudah dipakai"] },
      };
    }
  }

  try {
    const invitation = await invitationRepository.updateInvitation(id, parsed.data);

    revalidatePath("/dashboard");
    revalidatePath("/invitations");
    revalidatePath(`/i/${invitation.slug}`);
    return { success: true, data: invitation };
  } catch {
    return { success: false, error: "Gagal memperbarui invitation" };
  }
}

export async function deleteInvitation(id: string): Promise<ActionResult<null>> {
  try {
    await invitationRepository.deleteInvitation(id);

    revalidatePath("/dashboard");
    revalidatePath("/invitations");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Gagal menghapus invitation" };
  }
}

export async function publishInvitation(id: string): Promise<ActionResult<Invitation>> {
  try {
    const invitation = await invitationRepository.publishInvitation(id);

    revalidatePath("/dashboard");
    revalidatePath("/invitations");
    revalidatePath(`/i/${invitation.slug}`);
    return { success: true, data: invitation };
  } catch {
    return { success: false, error: "Gagal mem-publish invitation" };
  }
}
