import { db } from "@/lib/db";

import type { CreateRsvpInput, Rsvp } from "./types";

/**
 * Repository layer untuk Rsvp. Semua akses `prisma.rsvp.*` HARUS lewat
 * sini — jangan panggil `db.rsvp` langsung dari action/component.
 */

export async function createRsvp(input: CreateRsvpInput): Promise<Rsvp> {
  return db.rsvp.create({ data: input });
}

export async function getRsvpsByInvitationId(invitationId: string): Promise<Rsvp[]> {
  return db.rsvp.findMany({
    where: { invitationId },
    orderBy: { createdAt: "desc" },
  });
}
