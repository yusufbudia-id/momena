"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SectionProps } from "../../../../types";

export function Gift({ invitation }: SectionProps) {
  const [copied, setCopied] = useState<string | null>(null);
  if (invitation.gifts.length === 0) return null;

  async function copy(id: string, number: string) {
    await navigator.clipboard.writeText(number);
    setCopied(id);
    toast.success("Nomor disalin");
    setTimeout(() => setCopied(null), 1400);
  }

  return (
    <section id="gift" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[720px]">
        <div className="grid gap-5 border-b border-[var(--minimal-line)] pb-6 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">05 · Gift</p>
            <h2 className="font-display mt-3 text-4xl tracking-[-0.04em] text-[var(--minimal-ink)] italic">Tanda kasih.</h2>
          </div>
          <p className="text-sm leading-6 text-[var(--minimal-muted)] sm:text-right">
            Kehadiran dan doa Anda adalah hadiah utama. Bagian ini tersedia bila ingin berbagi tanda kasih.
          </p>
        </div>

        <div className="divide-y divide-[var(--minimal-line)]">
          {invitation.gifts.map((gift, index) => (
            <div key={gift.id} className="grid gap-3 py-6 sm:grid-cols-[52px_1fr_auto] sm:items-center">
              <span className="text-[9px] tracking-[0.22em] text-[var(--minimal-muted)]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[10px] tracking-[0.22em] text-[var(--minimal-accent)] uppercase">{gift.label}</p>
                {gift.number && <p className="mt-2 text-lg tracking-[0.08em] text-[var(--minimal-ink)]">{gift.number}</p>}
                {gift.holderName && <p className="mt-1 text-sm text-[var(--minimal-muted)]">a.n. {gift.holderName}</p>}
                {gift.note && <p className="mt-1 text-sm leading-6 text-[var(--minimal-muted)]">{gift.note}</p>}
                {gift.qrImageUrl && <div className="mt-3 w-28 border border-[var(--minimal-line)] bg-white p-2">{/* eslint-disable-next-line @next/next/no-img-element -- QR Cloudinary dinamis */}<img src={gift.qrImageUrl} alt={`QR ${gift.label}`} className="aspect-square w-full object-contain" /></div>}
              </div>
              {gift.number && (
                <button
                  onClick={() => copy(gift.id, gift.number!)}
                  className="inline-flex h-10 w-fit items-center gap-2 border-b border-[var(--minimal-line-strong)] text-[10px] tracking-[0.18em] text-[var(--minimal-ink)] uppercase hover:opacity-60"
                >
                  {copied === gift.id ? <><Check className="size-3.5" /> Tersalin</> : <><Copy className="size-3.5" /> Salin</>}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
