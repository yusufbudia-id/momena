import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Search } from "lucide-react";
import Link from "next/link";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InvitationActionsCell } from "@/features/invitation/components/invitation-actions-cell";
import { getInvitationsPage } from "@/features/invitation/repository";
import type { InvitationListItem, InvitationStatus } from "@/features/invitation/types";
import { getCurrentUserId } from "@/lib/temp-auth";

const PAGE_SIZE = 10;

const statusLabel: Record<InvitationStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const statusTone: Record<InvitationStatus, "warning" | "success" | "neutral"> = {
  DRAFT: "warning",
  PUBLISHED: "success",
  ARCHIVED: "neutral",
};

const columns: ColumnDef<InvitationListItem>[] = [
  {
    accessorKey: "title",
    header: "Nama Acara",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <span className="text-ink-soft">/i/{row.original.slug}</span>,
  },
  {
    id: "template",
    header: "Template",
    cell: ({ row }) => row.original.template.name,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusTone[row.original.status]}>
        {statusLabel[row.original.status]}
      </Badge>
    ),
  },
  {
    accessorKey: "eventDate",
    header: "Tanggal",
    cell: ({ row }) =>
      row.original.eventDate
        ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
            row.original.eventDate,
          )
        : "—",
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    cell: ({ row }) => <InvitationActionsCell invitation={row.original} />,
  },
];

interface InvitationsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function InvitationsPage({ searchParams }: InvitationsPageProps) {
  const params = await searchParams;
  const search = params.q?.trim() || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const userId = await getCurrentUserId();
  const result = await getInvitationsPage({ userId, page, pageSize: PAGE_SIZE, search });

  const buildHref = (targetPage: number) => {
    const qs = new URLSearchParams();
    if (search) qs.set("q", search);
    qs.set("page", String(targetPage));
    return `/invitations?${qs.toString()}`;
  };

  return (
    <div>
      <PageHeader
        title="Invitations"
        description="Semua undangan yang pernah kamu buat."
        actions={
          <Button variant="accent" asChild>
            <Link href="/invitations/new">Buat Invitation</Link>
          </Button>
        }
      />

      <form method="GET" className="mb-4 flex max-w-sm items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-ink-soft absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Cari nama acara…"
            className="border-line bg-surface text-ink placeholder:text-ink-soft/60 h-9 w-full rounded-md border pr-3 pl-9 text-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
          />
        </div>
        <Button type="submit" variant="outline">
          Cari
        </Button>
      </form>

      {result.data.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={search ? "Tidak ada hasil" : "Belum ada invitation"}
          description={
            search
              ? `Tidak ada undangan yang cocok dengan "${search}".`
              : "Mulai buat undangan digital pertama kamu."
          }
          action={
            !search && (
              <Button variant="accent" asChild>
                <Link href="/invitations/new">Buat Invitation</Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <DataTable columns={columns} data={result.data} />
          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            buildHref={buildHref}
          />
        </>
      )}
    </div>
  );
}
