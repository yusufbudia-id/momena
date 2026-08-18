import { Instagram } from "lucide-react";

import type { SectionProps } from "../../types";

export function BrideGroom({ invitation }: SectionProps) {
  if (!invitation.couple) return null;

  const { first, second, firstParents, secondParents, firstInstagram, secondInstagram } =
    invitation.couple;

  return (
    <section className="px-6 py-16 text-center">
      <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">Kedua Mempelai</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
        <div>
          <p className="font-display text-ink text-3xl italic">{first}</p>
          {firstParents && <p className="text-ink-soft mt-2 text-xs">{firstParents}</p>}
          {firstInstagram && (
            <a
              href={`https://instagram.com/${firstInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent mt-1 inline-flex items-center gap-1 text-xs hover:underline"
            >
              <Instagram className="size-3" />@{firstInstagram}
            </a>
          )}
        </div>
        <span className="text-accent text-2xl">&</span>
        <div>
          <p className="font-display text-ink text-3xl italic">{second}</p>
          {secondParents && <p className="text-ink-soft mt-2 text-xs">{secondParents}</p>}
          {secondInstagram && (
            <a
              href={`https://instagram.com/${secondInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent mt-1 inline-flex items-center gap-1 text-xs hover:underline"
            >
              <Instagram className="size-3" />@{secondInstagram}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
