import Image from "next/image";

import type { SectionProps } from "../../types";

export function Hero({ invitation }: SectionProps) {
  // Format tanggal menjadi sangat resmi (contoh: SABTU, 24 AGUSTUS 2026)
  const formattedDate = invitation.eventDate
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(invitation.eventDate)
    : null;

  // Mengambil nama individual jika datanya tersedia
  const couple = invitation.couple;

  return (
    <section className="relative flex min-h-[90dvh] flex-col items-center justify-center px-6 pt-12 pb-24 text-center">
      <div className="z-10 flex w-full flex-col items-center justify-center">
        
        {/* 1. EYEBROW TEXT */}
        <p className="mb-6 text-[10px] tracking-[0.4em] text-[var(--color-ink-soft)] uppercase">
          The Wedding Of
        </p>

        {/* 2. ARCH FRAMED IMAGE (Foto Berbingkai Melengkung) */}
        {invitation.coverImageUrl && (
          <div className="relative mb-8 aspect-[3/4] w-64 overflow-hidden rounded-t-full border-[6px] border-[var(--color-surface)] shadow-xl sm:w-80 md:w-96">
            <Image
              src={invitation.coverImageUrl}
              alt="Cover Photo"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Garis halus di dalam bingkai */}
            <div className="absolute inset-0 rounded-t-full ring-1 ring-inset ring-[var(--color-line)]/50"></div>
          </div>
        )}

        {/* 3. OVERLAPPING NAMES (Nama Tumpang Tindih) */}
        {/* Margin negatif (-mt-16) menarik nama ke atas agar menimpa foto */}
        <div className="relative z-20 -mt-16 sm:-mt-24">
          {couple ? (
            <h1 className="flex flex-col items-center drop-shadow-md">
              <span className="font-display text-5xl leading-none italic text-[var(--color-ink)] sm:text-7xl">
                {couple.first}
              </span>
              <span className="font-display -my-3 text-3xl italic text-[var(--color-accent-ink)] sm:-my-5 sm:text-5xl">
                &amp;
              </span>
              <span className="font-display text-5xl leading-none italic text-[var(--color-ink)] sm:text-7xl">
                {couple.second}
              </span>
            </h1>
          ) : (
            <h1 className="font-display text-5xl leading-tight italic text-[var(--color-ink)] drop-shadow-md sm:text-7xl">
              {invitation.title}
            </h1>
          )}
        </div>

        {/* 4. GOLD VERTICAL DIVIDER */}
        <div className="my-8 h-12 w-px bg-[var(--color-accent)]/50"></div>

        {/* 5. STRUCTURED EVENT INFO */}
        <div className="flex flex-col items-center gap-3">
          {formattedDate && (
            <p className="text-[11px] tracking-[0.25em] text-[var(--color-ink-soft)] uppercase sm:text-xs">
              {formattedDate}
            </p>
          )}
          {invitation.eventLocation && (
            <p className="text-sm font-medium tracking-[0.15em] text-[var(--color-ink)] uppercase">
              {invitation.eventLocation}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}