import { Instagram } from "lucide-react";
import Image from "next/image";

import type { SectionProps } from "../../../../types";

function PersonChapter({
  name,
  parents,
  instagram,
  image,
  label,
  number,
  reverse = false,
  positionX,
  positionY,
}: {
  name: string;
  parents: string | null;
  instagram: string | null;
  image: string | null;
  label: string;
  number: string;
  reverse?: boolean;
  positionX: number;
  positionY: number;
}) {
  return (
    <article className="relative min-h-[88svh] overflow-hidden border-b border-black/10 bg-[#efeee9] text-[#0b0d12]">
      <div className="pointer-events-none absolute inset-x-0 top-6 text-center text-[clamp(8rem,30vw,22rem)] font-black leading-none tracking-[-.09em] text-black/[.035] uppercase">
        {number}
      </div>
      <div className="mx-auto grid min-h-[88svh] max-w-[1500px] items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-20">
        <div className={`${reverse ? "lg:order-2" : ""} relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden bg-[#151822]`}>
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width:1024px) 45vw, 90vw"
              className="object-cover grayscale-[8%]"
              style={{ objectPosition: `${positionX}% ${positionY}%` }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-9xl font-black text-white/10">{name[0]}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
            <span className="text-[9px] tracking-[.32em] text-white/65 uppercase">{label}</span>
            <span className="text-[9px] tracking-[.32em] text-white/42 uppercase">Momena / Modern</span>
          </div>
        </div>

        <div className={`${reverse ? "lg:order-1 lg:text-right" : ""} relative z-10`}>
          <p className="text-[10px] font-bold tracking-[.36em] text-[var(--modern-violet)] uppercase">{number} / {label}</p>
          <h3 className="mt-3 text-[clamp(4rem,12vw,8rem)] font-black leading-[.76] tracking-[-.075em] uppercase">
            {name}
          </h3>
          {parents && (
            <p className={`mt-7 max-w-sm text-sm leading-7 text-black/52 ${reverse ? "lg:ml-auto" : ""}`}>
              {parents}
            </p>
          )}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 border-b border-black/25 pb-1 text-xs font-bold tracking-[.12em] text-black/70 uppercase transition hover:border-[#ff5f9f] hover:text-[#ff5f9f]"
            >
              <Instagram className="size-3.5" /> @{instagram}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function BrideGroom({ invitation }: SectionProps) {
  if (!invitation.couple) return null;
  const { first, second, firstParents, secondParents, firstInstagram, secondInstagram } = invitation.couple;

  return (
    <section>
      <PersonChapter
        name={first}
        parents={firstParents}
        instagram={firstInstagram}
        image={invitation.groomPhotoUrl ?? invitation.gallery[0]?.imageUrl ?? null}
        positionX={invitation.groomPhotoUrl ? invitation.groomPhotoPositionX : 50}
        positionY={invitation.groomPhotoUrl ? invitation.groomPhotoPositionY : 50}
        label="The groom"
        number="01"
      />
      <PersonChapter
        name={second}
        parents={secondParents}
        instagram={secondInstagram}
        image={invitation.bridePhotoUrl ?? invitation.gallery[1]?.imageUrl ?? null}
        positionX={invitation.bridePhotoUrl ? invitation.bridePhotoPositionX : 50}
        positionY={invitation.bridePhotoUrl ? invitation.bridePhotoPositionY : 50}
        label="The bride"
        number="02"
        reverse
      />
    </section>
  );
}
