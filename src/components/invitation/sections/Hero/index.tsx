import Image from "next/image";

import type { SectionProps } from "../../types";

export function Hero({ invitation }: SectionProps) {
  const formattedDate = invitation.eventDate
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(invitation.eventDate)
    : null;

  return (
    <section className="relative flex min-h-[70dvh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {invitation.coverImageUrl && (
        // Cover ada di atas layar (LCP) — priority supaya di-preload,
        // bukan lazy-load seperti Gallery.
        <Image
          src={invitation.coverImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-40"
            style={{ objectPosition: `${invitation.coverImagePositionX}% ${invitation.coverImagePositionY}%` }}
        />
      )}
      <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">Undangan Digital</p>
      <h1 className="font-display text-ink mt-4 text-4xl italic sm:text-5xl">
        {invitation.title}
      </h1>
      {formattedDate && <p className="text-ink-soft mt-4 text-sm">{formattedDate}</p>}
      {invitation.eventLocation && (
        <p className="text-ink-soft mt-1 text-sm">{invitation.eventLocation}</p>
      )}
    </section>
  );
}
