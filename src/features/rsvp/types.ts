import type { Rsvp, RsvpStatus } from "@prisma/client";

export type { Rsvp, RsvpStatus };

export type CreateRsvpInput = {
  invitationId: string;
  guestName: string;
  phone?: string | null;
  attendeeCount: number;
  status: RsvpStatus;
  message?: string | null;
};
