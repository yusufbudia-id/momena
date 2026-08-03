"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";

import type { InvitationListItem, InvitationStatus } from "../types";

import { InvitationActionsCell } from "./invitation-actions-cell";

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

// Kolom (berisi fungsi `cell`) HARUS didefinisikan di dalam Client Component
// ini, bukan di Server Component pemanggilnya — fungsi tidak bisa dioper
// lewat props dari Server ke Client Component (RSC serialization error).
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

interface InvitationsTableProps {
  data: InvitationListItem[];
}

export function InvitationsTable({ data }: InvitationsTableProps) {
  return <DataTable columns={columns} data={data} />;
}
