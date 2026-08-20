import { Instagram } from "lucide-react";
import Image from "next/image";

import type { SectionProps } from "../../../../types";

function Person({
  name,
  parents,
  instagram,
  src,
  index,
}: {
  name: string;
  parents: string | null;
  instagram: string | null;
  src: string | null;
  index: "01" | "02";
}) {
  return (
    <article>
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--minimal-soft)]">
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            sizes="(min-width: 640px) 300px, 86vw"
            className="object-cover grayscale-[14%] saturate-[.78] transition duration-700 hover:scale-[1.015]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-6xl text-[var(--minimal-line-strong)] italic">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <span className="absolute top-4 left-4 text-[9px] tracking-[0.3em] text-white/80 uppercase">
          {index}
        </span>
      </div>
      <div className="mt-5 border-t border-[var(--minimal-line)] pt-4">
        <h3 className="font-display text-3xl tracking-[-0.03em] text-[var(--minimal-ink)] italic sm:text-4xl">
          {name}
        </h3>
        {parents && (
          <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--minimal-muted)]">{parents}</p>
        )}
        {instagram && (
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-[var(--minimal-accent)] uppercase hover:opacity-70"
          >
            <Instagram className="size-3.5" strokeWidth={1.5} />@{instagram}
          </a>
        )}
      </div>
    </article>
  );
}

export function BrideGroom({ invitation }: SectionProps) {
  if (!invitation.couple) return null;
  const { first, second, firstParents, secondParents, firstInstagram, secondInstagram } = invitation.couple;

  return (
    <section id="couple" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[720px]">
        <div className="grid gap-5 border-b border-[var(--minimal-line)] pb-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">01 · Couple</p>
            <h2 className="font-display mt-3 text-4xl tracking-[-0.04em] text-[var(--minimal-ink)] italic sm:text-5xl">
              Dua cerita, satu perjalanan.
            </h2>
          </div>
          <p className="max-w-[240px] text-sm leading-6 text-[var(--minimal-muted)] sm:text-right">
            Dengan restu keluarga, kami mengundang Anda untuk menjadi bagian dari hari istimewa ini.
          </p>
        </div>

        <div className="mt-9 grid gap-10 sm:grid-cols-2 sm:gap-5">
          <Person
            name={first}
            parents={firstParents}
            instagram={firstInstagram}
            src={invitation.gallery[0]?.imageUrl ?? null}
            index="01"
          />
          <div className="sm:pt-20">
            <Person
              name={second}
              parents={secondParents}
              instagram={secondInstagram}
              src={invitation.gallery[1]?.imageUrl ?? null}
              index="02"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
