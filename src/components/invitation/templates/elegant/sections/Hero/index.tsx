import Image from "next/image";

import type { SectionProps } from "../../../../types";

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute size-8 border-[var(--color-accent)]/70 ${className}`}
    />
  );
}

export function Hero({ invitation }: SectionProps) {
  const first = invitation.couple?.first ?? invitation.title;
  const second = invitation.couple?.second ?? "";

  const formattedDate = invitation.eventDate
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(invitation.eventDate)
    : null;

  return (
    <section className="relative flex min-h-[88svh] items-center justify-center overflow-hidden px-2 py-14 text-center sm:px-8 sm:py-24">
      <div
        aria-hidden
        className="luxe-glow pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(92vw,650px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-accent)]/10"
      />
      <div
        aria-hidden
        className="luxe-glow pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(68vw,450px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--color-accent)]/12"
      />

      <div className="luxe-sweep relative w-full max-w-xl overflow-hidden border border-[var(--color-accent)]/26 bg-[linear-gradient(180deg,rgba(201,162,92,.055),rgba(13,12,9,.60)_34%,rgba(13,12,9,.48))] px-5 py-12 shadow-[0_0_0_6px_rgba(201,162,92,0.025),0_0_0_7px_rgba(201,162,92,0.10),0_32px_120px_rgba(0,0,0,0.52),inset_0_0_85px_rgba(0,0,0,0.25)] backdrop-blur-[2px] sm:px-12 sm:py-16">
        <Corner className="left-[-1px] top-[-1px] border-l-2 border-t-2" />
        <Corner className="right-[-1px] top-[-1px] border-r-2 border-t-2" />
        <Corner className="bottom-[-1px] left-[-1px] border-b-2 border-l-2" />
        <Corner className="bottom-[-1px] right-[-1px] border-b-2 border-r-2" />

        <div className="mx-auto mb-7 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-accent)]/70" />
          <span className="text-[9px] tracking-[0.55em] text-[var(--color-accent)]">✦ ✦ ✦</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-accent)]/70" />
        </div>

        <p className="text-[10px] tracking-[0.6em] text-[var(--color-accent)]/80 uppercase">
          The Wedding Of
        </p>

        {invitation.coverImageUrl && (
          <div className="relative mx-auto mt-7 aspect-[4/5] w-full max-w-[250px] overflow-hidden border border-[var(--color-accent)]/30 shadow-2xl sm:max-w-[280px]">
            <Image
              src={invitation.coverImageUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 640px) 280px, 250px"
              className="object-cover opacity-90 grayscale-[12%] contrast-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
            <div className="absolute inset-3 border border-[var(--color-accent)]/25" />
          </div>
        )}

        <div className={invitation.coverImageUrl ? "relative z-10 -mt-12" : "mt-8"}>
          <h1 className="font-display px-2 text-[clamp(3.2rem,12vw,6.5rem)] leading-[0.88] text-[var(--color-gold-light)] italic drop-shadow-[0_5px_16px_rgba(201,162,92,0.2)]">
            {first}
          </h1>
          {second && (
            <>
              <span className="font-display my-1 block text-3xl text-[var(--color-accent)]/55 italic">&amp;</span>
              <h1 className="font-display px-2 text-[clamp(3.2rem,12vw,6.5rem)] leading-[0.88] text-[var(--color-gold-light)] italic drop-shadow-[0_5px_16px_rgba(201,162,92,0.2)]">
                {second}
              </h1>
            </>
          )}
        </div>

        <div className="mx-auto my-7 flex max-w-[220px] items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-accent)]/60" />
          <span className="size-1.5 rotate-45 bg-[var(--color-accent)]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-accent)]/60" />
        </div>

        {formattedDate && (
          <p className="text-xs tracking-[0.18em] text-[var(--color-gold-light)] uppercase sm:text-sm">
            {formattedDate}
          </p>
        )}
        {invitation.eventLocation && (
          <p className="mt-2 font-serif text-sm italic text-[var(--color-ink-soft)]">
            {invitation.eventLocation}
          </p>
        )}

        <p className="mt-7 text-[9px] tracking-[0.42em] text-[var(--color-accent)]/50 uppercase">
          {invitation.tagline || "With love & blessing"}
        </p>
      </div>
    </section>
  );
}
