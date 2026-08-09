import Image from "next/image";

import type { SectionProps } from "../../../../types";

/**
 * Hero versi "Magazine Style" — section ini LOKAL untuk Elegant saja
 * (hasil duplikasi dari `components/invitation/sections/Hero`, bukan yang
 * dipakai Minimal/Modern). Foto cover dibingkai kubah/arch, nama mempelai
 * besar ditarik naik menumpuk di atas foto, divider emas tipis sebelum
 * info tanggal acara.
 */
export function Hero({ invitation }: SectionProps) {
  const coupleName = invitation.couple
    ? `${invitation.couple.first} & ${invitation.couple.second}`
    : invitation.title;

  const formattedDate = invitation.eventDate
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(invitation.eventDate)
    : null;

  return (
    <section className="flex flex-col items-center px-6 pt-10 pb-16 text-center">
      <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">Undangan Digital</p>

      {invitation.coverImageUrl && (
        <div className="border-accent relative mt-6 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-t-full border-[6px]">
          <Image
            src={invitation.coverImageUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 640px) 384px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <h1 className="font-display text-ink bg-paper relative z-10 -mt-10 max-w-xs px-4 text-4xl italic sm:text-5xl">
        {coupleName}
      </h1>

      {(formattedDate || invitation.eventLocation) && (
        <div className="mt-5 flex flex-col items-center gap-3">
          <span aria-hidden className="bg-accent h-8 w-px" />
          {formattedDate && <p className="text-ink-soft text-sm">{formattedDate}</p>}
          {invitation.eventLocation && (
            <p className="text-ink-soft text-sm">{invitation.eventLocation}</p>
          )}
        </div>
      )}
    </section>
  );
}
