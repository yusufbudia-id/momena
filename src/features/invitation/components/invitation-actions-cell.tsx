"use client";

import { Eye, Pencil, Send, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";

import { deleteInvitation, publishInvitation } from "../actions";
import type { InvitationListItem } from "../types";

import { PublishResultDialog } from "./publish-result-dialog";

export function InvitationActionsCell({
  invitation,
}: {
  invitation: InvitationListItem;
}) {
  const router = useRouter();
  const [showPublishResult, setShowPublishResult] = useState(false);
  const [isPublishing, startPublishTransition] = useTransition();

  function handlePublish() {
    startPublishTransition(async () => {
      const result = await publishInvitation(invitation.id);
      if (result.success) {
        toast.success("Invitation berhasil dipublish");
        setShowPublishResult(true);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label="Preview" asChild>
        <Link href={`/i/${invitation.slug}`} target="_blank">
          <Eye className="size-4" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" aria-label="Edit" asChild>
        <Link href={`/invitations/${invitation.id}/edit`}>
          <Pencil className="size-4" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" aria-label="RSVP" asChild>
        <Link href={`/invitations/${invitation.id}/rsvp`}>
          <Users className="size-4" />
        </Link>
      </Button>

      {invitation.status !== "PUBLISHED" && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Publish"
          onClick={handlePublish}
          disabled={isPublishing}
        >
          <Send className="size-4" />
        </Button>
      )}

      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon" aria-label="Delete">
            <Trash2 className="size-4 text-red-600" />
          </Button>
        }
        title="Hapus invitation ini?"
        description={`"${invitation.title}" akan dihapus permanen, termasuk gallery dan gift di dalamnya. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={async () => {
          const result = await deleteInvitation(invitation.id);
          if (result.success) {
            toast.success("Invitation dihapus");
            router.refresh();
          } else {
            toast.error(result.error);
          }
          return result;
        }}
      />

      <PublishResultDialog
        open={showPublishResult}
        onOpenChange={setShowPublishResult}
        slug={invitation.slug}
      />
    </div>
  );
}
