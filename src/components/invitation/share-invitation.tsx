"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareInvitation({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `Undangan ${title}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // User cancelled native share or clipboard unavailable.
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="fixed right-4 bottom-4 z-[70] flex h-11 items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 text-xs font-medium text-white shadow-xl backdrop-blur-md transition hover:bg-black/85"
      aria-label="Bagikan undangan"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {copied ? "Link disalin" : "Bagikan"}
    </button>
  );
}
