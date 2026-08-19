import { Instagram } from "lucide-react";
import Image from "next/image";

import type { SectionProps } from "../../../../types";

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
      className={`group relative aspect-[4/5] w-[min(68vw,13rem)] overflow-hidden border border-[var(--color-accent)]/34 shadow-[0_20px_58px_rgba(0,0,0,.38)] sm:w-56 ${
        align === "end" ? "self-end" : "self-start"
      }`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 640px) 224px, 68vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface)]">
          <span className="font-display text-5xl text-[var(--color-accent)]/40 italic">
            {initial}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-black/8" />
      <div className="pointer-events-none absolute inset-3 border border-[var(--color-accent)]/16" />
    </div>
  );
}

function RoleLabel({ children, align }: { children: string; align: "left" | "right" }) {
  return (
    <p
      className={`mb-3 text-[9px] tracking-[0.48em] text-[var(--color-accent)]/75 uppercase ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </p>
  );
}

export function BrideGroom({ invitation }: SectionProps) {
  if (!invitation.couple) return null;

  const { first, second, firstParents, secondParents, firstInstagram, secondInstagram } =
    invitation.couple;
  const firstPhoto = invitation.gallery[0]?.imageUrl ?? null;
  const secondPhoto = invitation.gallery[1]?.imageUrl ?? null;

  return (
    <section className="relative overflow-hidden px-1 py-10 sm:px-6 sm:py-20">
      <div className="mb-9 text-center sm:mb-12">
        <p className="text-[9px] tracking-[0.52em] text-[var(--color-accent)]/70 uppercase">The Couple</p>
        <h2 className="font-display mt-3 text-3xl italic text-[var(--color-ink)] sm:text-4xl">
          Dua Hati, Satu Perjalanan
        </h2>
      </div>

      <span
        aria-hidden
        className="font-display pointer-events-none absolute inset-0 flex items-center justify-center pt-20 text-[clamp(9rem,40vw,22rem)] text-[var(--color-accent)]/[0.075] italic select-none"
      >
        &amp;
      </span>

      <div className="relative mx-auto flex max-w-sm flex-col gap-20 sm:max-w-lg sm:gap-24">
        <div className="flex flex-col items-start">
          <PersonPhoto src={firstPhoto} initial={first.charAt(0)} align="start" />
          <div className="relative -mt-8 ml-3 max-w-[88%] border-l border-[var(--color-accent)]/22 bg-[var(--color-surface)]/95 px-4 py-3 sm:ml-8">
            <RoleLabel align="left">The Groom</RoleLabel>
            <h3 className="font-display text-[clamp(2.4rem,11vw,3.4rem)] leading-none text-[var(--color-ink)] italic">
              {first}
            </h3>
            {firstParents && (
              <p className="mt-3 text-[10px] leading-5 tracking-[0.22em] text-[var(--color-ink-soft)] uppercase sm:tracking-[0.3em]">
                {firstParents}
              </p>
            )}
            {firstInstagram && (
              <a
                href={`https://instagram.com/${firstInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-ink)] transition-opacity hover:opacity-75"
              >
                <Instagram className="size-3.5" />@{firstInstagram}
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end sm:mt-10">
          <PersonPhoto src={secondPhoto} initial={second.charAt(0)} align="end" />
          <div className="relative -mt-8 mr-3 max-w-[88%] border-r border-[var(--color-accent)]/22 bg-[var(--color-surface)]/95 px-4 py-3 text-right sm:mr-8">
            <RoleLabel align="right">The Bride</RoleLabel>
            <h3 className="font-display text-[clamp(2.4rem,11vw,3.4rem)] leading-none text-[var(--color-accent-ink)] italic">
              {second}
            </h3>
            {secondParents && (
              <p className="mt-3 text-[10px] leading-5 tracking-[0.22em] text-[var(--color-ink-soft)] uppercase sm:tracking-[0.3em]">
                {secondParents}
              </p>
            )}
            {secondInstagram && (
              <a
                href={`https://instagram.com/${secondInstagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-end gap-1.5 text-xs text-[var(--color-accent-ink)] transition-opacity hover:opacity-75"
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
