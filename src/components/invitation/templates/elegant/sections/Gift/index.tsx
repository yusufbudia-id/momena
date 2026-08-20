"use client";

import { Check, Copy, Gift as GiftIcon } from "lucide-react";
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
    <section className="px-0 py-2 text-center">
      <div className="mx-auto max-w-xl">
        <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
          Gift
        </p>
        <h2 className="font-display mt-3 text-3xl italic text-[var(--color-ink)] sm:text-4xl">
          Tanda Kasih
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
          Kehadiran dan doa restu Anda sudah lebih dari cukup. Namun jika ingin berbagi
          tanda kasih, Anda dapat menggunakan detail berikut.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
        {invitation.gifts.map((gift) => (
          <div
            key={gift.id}
            className="relative overflow-hidden border border-[var(--color-accent)]/18 bg-[linear-gradient(180deg,rgba(201,162,92,.06),rgba(0,0,0,0))] px-5 py-5 shadow-[inset_0_0_40px_rgba(201,162,92,.02),0_14px_36px_rgba(0,0,0,.16)]"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[var(--color-accent)] uppercase">
                  <GiftIcon className="size-3.5" strokeWidth={1.7} />
                  {gift.label}
                </p>
                {gift.number && (
                  <p className="mt-3 text-lg tracking-[0.12em] text-[var(--color-gold-light)] sm:text-xl">
                    {gift.number}
                  </p>
                )}
                {gift.holderName && (
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    a.n. {gift.holderName}
                  </p>
                )}
                {gift.note && (
                  <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
                    {gift.note}
                  </p>
                )}
              </div>

              {gift.number && (
                <button
                  onClick={() => handleCopy(gift.id, gift.number!)}
                  className="flex h-11 shrink-0 items-center gap-2 border border-[var(--color-accent)]/40 px-4 text-[10px] tracking-[0.22em] text-[var(--color-accent-ink)] uppercase transition-all hover:bg-[var(--color-accent)] hover:text-[var(--luxe-button-ink)]"
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
          </div>
        ))}
      </div>
    </section>
  );
}
