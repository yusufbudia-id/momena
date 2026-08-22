import { Download, Search, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GuestLinkBuilder } from "@/features/invitation/components/guest-link-builder";
import { getInvitationById } from "@/features/invitation/repository";
import { getCurrentUserId } from "@/lib/temp-auth";

const statusLabel = { ATTENDING: "Hadir", NOT_ATTENDING: "Tidak Hadir", MAYBE: "Masih Ragu" } as const;
const statusTone = { ATTENDING: "success", NOT_ATTENDING: "neutral", MAYBE: "warning" } as const;

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function InvitationRsvpPage({ params, searchParams }: Props) {
  const [{ id }, filters, userId] = await Promise.all([params, searchParams, getCurrentUserId()]);
  const invitation = await getInvitationById(id);
  if (!invitation || invitation.userId !== userId) notFound();

  const q = filters.q?.trim().toLowerCase() ?? "";
  const status = filters.status ?? "ALL";
  const all = [...invitation.rsvps].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const rsvps = all.filter((item) => {
    const matchesStatus = status === "ALL" || item.status === status;
    const haystack = `${item.guestName} ${item.phone ?? ""} ${item.message ?? ""}`.toLowerCase();
    return matchesStatus && (!q || haystack.includes(q));
  });

  const attending = all.filter((item) => item.status === "ATTENDING");
  const totalPeople = attending.reduce((sum, item) => sum + item.attendeeCount, 0);
  const notAttending = all.filter((item) => item.status === "NOT_ATTENDING").length;
  const maybe = all.filter((item) => item.status === "MAYBE").length;

  return (
    <div>
      <PageHeader
        title={`Tamu & RSVP: ${invitation.title}`}
        description={`${all.length} respons · ${totalPeople} orang terkonfirmasi hadir.`}
        actions={<div className="flex items-center gap-2"><Button asChild variant="outline" size="sm"><a href={`/api/invitations/${id}/rsvp/export`}><Download className="size-4" /> Export CSV</a></Button><Link href={`/invitations/${id}/edit`} className="text-ink-soft hover:text-ink text-sm">← Edit</Link></div>}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        {[['Respons', all.length], ['Hadir', attending.length], ['Total Orang', totalPeople], ['Tidak / Ragu', `${notAttending} / ${maybe}`]].map(([label,value]) => (
          <div key={String(label)} className="border-line bg-surface rounded-xl border p-4"><p className="text-xs text-ink-soft">{label}</p><p className="mt-1 text-2xl font-semibold text-ink">{value}</p></div>
        ))}
      </div>

      <GuestLinkBuilder slug={invitation.slug} />

      <form className="border-line bg-surface mb-5 grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_200px_auto]">
        <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" /><Input name="q" defaultValue={filters.q ?? ""} placeholder="Cari nama, telepon, ucapan…" className="pl-9" /></div>
        <select name="status" defaultValue={status} className="border-input bg-background h-10 rounded-md border px-3 text-sm"><option value="ALL">Semua status</option><option value="ATTENDING">Hadir</option><option value="NOT_ATTENDING">Tidak Hadir</option><option value="MAYBE">Masih Ragu</option></select>
        <Button type="submit" variant="accent">Terapkan</Button>
      </form>

      {all.length === 0 ? (
        <EmptyState icon={Users} title="Belum ada RSVP" description="Bagikan link undangan supaya tamu bisa konfirmasi kehadiran." />
      ) : rsvps.length === 0 ? (
        <EmptyState icon={Search} title="Tidak ada hasil" description="Coba ubah kata pencarian atau filter status." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <Table>
            <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Status</TableHead><TableHead>Jumlah</TableHead><TableHead>Kontak</TableHead><TableHead>Ucapan</TableHead><TableHead>Tanggal</TableHead></TableRow></TableHeader>
            <TableBody>{rsvps.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.guestName}</TableCell><TableCell><Badge variant={statusTone[item.status]}>{statusLabel[item.status]}</Badge></TableCell><TableCell>{item.attendeeCount}</TableCell><TableCell className="text-sm text-ink-soft">{item.phone || "—"}</TableCell><TableCell className="max-w-xs text-sm text-ink-soft">{item.message || "—"}</TableCell><TableCell>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(item.createdAt)}</TableCell></TableRow>)}</TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
