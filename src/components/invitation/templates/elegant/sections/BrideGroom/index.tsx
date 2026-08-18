import { Instagram } from "lucide-react";
import Image from "next/image";

import type { SectionProps } from "../../../../types";

/**
 * Foto profil satu mempelai — portrait (bukan lingkaran), border halus.
 * Fallback ke monogram inisial kalau belum ada foto (bukan gambar rusak).
 */
function PersonPhoto({
  src,
  initial,
  align,
}: {
  src: string | null;
  initial: string;
  align: "start" | "end";
}) {
  return (
    <div
      className={`relative aspect-[4/5] w-48 overflow-hidden border border-[var(--color-accent)]/40 sm:w-56 ${
        align === "end" ? "self-end" : "self-start"
      }`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 640px) 224px, 192px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface)]">
          <span className="font-display text-5xl text-[var(--color-accent)]/40 italic">
            {initial}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * BrideGroom versi "Editorial Magazine" — section ini LOKAL untuk Elegant
 * saja (duplikat dari `components/invitation/sections/BrideGroom`, tidak
 * memengaruhi Minimal/Modern). Layout asimetris/staggered, ampersand
 * raksasa jadi watermark latar, foto portrait (bukan lingkaran), nama
 * mempelai overlap ke foto untuk kesan kedalaman, nama orang tua kecil
 * dengan tracking sangat renggang.
 *
 * Foto per-mempelai memakai `invitation.gallery[0]`/`[1]` (belum ada field
 * foto khusus per-orang di schema) — fallback ke monogram inisial elegan
 * kalau fotonya belum diisi, bukan gambar rusak.
 */
export function BrideGroom({ invitation }: SectionProps) {
  if (!invitation.couple) return null;

  const { first, second, firstParents, secondParents, firstInstagram, secondInstagram } =
    invitation.couple;
  const firstPhoto = invitation.gallery[0]?.imageUrl ?? null;
  const secondPhoto = invitation.gallery[1]?.imageUrl ?? null;

  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28">
      {/* Ampersand raksasa — watermark latar yang menjembatani kedua profil */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(9rem,40vw,22rem)] text-[var(--color-accent)]/10 italic select-none"
      >
        &amp;
      </span>

      <div className="relative mx-auto flex max-w-sm flex-col gap-20 sm:max-w-lg sm:gap-24">
        {/* Mempelai pria — rata kiri, foto sejajar atas */}
        <div className="flex flex-col items-start">
          <PersonPhoto src={firstPhoto} initial={first.charAt(0)} align="start" />
          <div className="-mt-8 ml-4 bg-[var(--color-paper)]/95 px-2 sm:ml-8">
            <h3 className="font-display text-4xl text-[var(--color-ink)] italic sm:text-5xl">
              {first}
            </h3>
            {firstParents && (
              <p className="mt-3 text-[10px] tracking-[0.35em] text-[var(--color-ink-soft)] uppercase">
                {firstParents}
              </p>
            )}
            {firstInstagram && (
              <a
                href={`https://instagram.com/${firstInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-ink)] hover:underline"
              >
                <Instagram className="size-3.5" />@{firstInstagram}
              </a>
            )}
          </div>
        </div>

        {/* Mempelai wanita — rata kanan, digeser turun (staggered) */}
        <div className="flex flex-col items-end sm:mt-14">
          <PersonPhoto src={secondPhoto} initial={second.charAt(0)} align="end" />
          <div className="-mt-8 mr-4 bg-[var(--color-paper)]/95 px-2 text-right sm:mr-8">
            <h3 className="font-display text-4xl text-[var(--color-accent-ink)] italic sm:text-5xl">
              {second}
            </h3>
            {secondParents && (
              <p className="mt-3 text-[10px] tracking-[0.35em] text-[var(--color-ink-soft)] uppercase">
                {secondParents}
              </p>
            )}
            {secondInstagram && (
              <a
                href={`https://instagram.com/${secondInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-end gap-1.5 text-xs text-[var(--color-accent-ink)] hover:underline"
              >
                @{secondInstagram}
                <Instagram className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
