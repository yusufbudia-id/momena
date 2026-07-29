import { Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInvitationById } from "@/features/invitation/repository";
import { getCurrentUserId } from "@/lib/temp-auth";

const statusLabel = {
  ATTENDING: "Hadir",
  NOT_ATTENDING: "Tidak Hadir",
  MAYBE: "Masih Ragu",
} as const;

const statusTone = {
  ATTENDING: "success",
  NOT_ATTENDING: "neutral",
  MAYBE: "warning",
} as const;

interface InvitationRsvpPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitationRsvpPage({ params }: InvitationRsvpPageProps) {
  const { id } = await params;

  const [invitation, userId] = await Promise.all([
    getInvitationById(id),
    getCurrentUserId(),
  ]);

  if (!invitation || invitation.userId !== userId) {
    notFound();
  }

  const rsvps = [...invitation.rsvps].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <div>
      <PageHeader
        title={`RSVP: ${invitation.title}`}
        description={
          rsvps.length > 0 ? `${rsvps.length} konfirmasi masuk dari tamu.` : undefined
        }
        actions={
          <Link
            href={`/invitations/${id}/edit`}
            className="text-ink-soft hover:text-ink text-sm"
          >
            ← Kembali ke Edit
          </Link>
        }
      />

      {rsvps.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum ada RSVP"
          description="Bagikan link undangan supaya tamu bisa konfirmasi kehadiran."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Jumlah Tamu</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rsvps.map((rsvp) => (
              <TableRow key={rsvp.id}>
                <TableCell className="font-medium">{rsvp.guestName}</TableCell>
                <TableCell>
                  <Badge variant={statusTone[rsvp.status]}>
                    {statusLabel[rsvp.status]}
                  </Badge>
                </TableCell>
                <TableCell>{rsvp.attendeeCount}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                    rsvp.createdAt,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
