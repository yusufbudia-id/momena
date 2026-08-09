"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { SectionProps } from "../../../../types";

export function Gift({ invitation }: SectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (invitation.gifts.length === 0) return null;

  async function handleCopy(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    toast.success("Nomor disalin ke clipboard");
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
  }

  return (
    <section className="px-6 py-16 text-center">
      <h2 className="font-display text-ink text-2xl italic">Kirim Hadiah</h2>
      <p className="text-ink-soft mt-2 text-sm">
        Doa restu Anda adalah hadiah terbaik. Jika ingin memberi tanda kasih, kami
        sediakan amplop digital berikut.
      </p>

      <div className="mx-auto mt-6 flex max-w-md flex-col gap-3">
        {invitation.gifts.map((gift) => (
          <div
            key={gift.id}
            className="border-line bg-surface rounded-xl border p-4 text-left"
          >
            <p className="text-ink-soft text-xs tracking-wide uppercase">{gift.label}</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-ink font-medium">{gift.number}</span>
              {gift.number && (
                <button
                  onClick={() => handleCopy(gift.id, gift.number!)}
                  className="border-line text-ink-soft hover:bg-paper flex h-11 items-center gap-1.5 rounded-md border px-3 text-xs"
                >
                  {copiedId === gift.id ? (
                    <>
                      <Check className="size-4" /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" /> Salin
                    </>
                  )}
                </button>
              )}
            </div>
            {gift.holderName && (
              <p className="text-ink-soft mt-1 text-sm">a.n. {gift.holderName}</p>
            )}
            {gift.note && <p className="text-ink-soft mt-1 text-sm">{gift.note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
