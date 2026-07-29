"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PublishResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
}

export function PublishResultDialog({
  open,
  onOpenChange,
  slug,
}: PublishResultDialogProps) {
  const [copied, setCopied] = useState(false);

  // Fallback ke path relatif kalau dirender sebelum hydration sempat baca origin.
  const link =
    typeof window !== "undefined" ? `${window.location.origin}/i/${slug}` : `/i/${slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link disalin ke clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitation dipublish 🎉</DialogTitle>
          <DialogDescription>
            Undangan kamu sudah bisa diakses lewat link berikut.
          </DialogDescription>
        </DialogHeader>

        <div className="border-line bg-paper flex items-center gap-2 rounded-md border px-3 py-2">
          <span className="text-ink flex-1 truncate text-sm">{link}</span>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="size-3.5" /> Tersalin
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Copy Link
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
