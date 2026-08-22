import { NextResponse } from "next/server";

import { getInvitationById } from "@/features/invitation/repository";
import { getCurrentUserId } from "@/lib/temp-auth";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [invitation, userId] = await Promise.all([
    getInvitationById(id),
    getCurrentUserId(),
  ]);

  if (!invitation || invitation.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rows = [
    ["Nama", "Status", "Jumlah Tamu", "Telepon", "Ucapan", "Tanggal"],
    ...[...invitation.rsvps]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((item) => [
        item.guestName,
        item.status,
        item.attendeeCount,
        item.phone ?? "",
        item.message ?? "",
        item.createdAt.toISOString(),
      ]),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const safeSlug = invitation.slug.replace(/[^a-z0-9-]/gi, "-");

  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvp-${safeSlug}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
