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
  const split = invitation.settings.heroLayout === "split";

  const dateParts = invitation.eventDate
    ? {
        day: new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(invitation.eventDate),
        month: new Intl.DateTimeFormat("id-ID", { month: "long" }).format(invitation.eventDate),
        year: new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(invitation.eventDate),
        weekday: new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(invitation.eventDate),
      }
    : null;

  if (split) {
    return (
      <section className="relative flex min-h-[88svh] items-center overflow-hidden px-3 py-10 sm:px-8 sm:py-20">
        <div className="mx-auto grid w-full max-w-4xl gap-0 overflow-hidden border border-[var(--color-accent)]/28 bg-[var(--luxe-hero-fill)] shadow-[var(--luxe-hero-shadow)] sm:grid-cols-[.92fr_1.08fr]">
          <div className="relative min-h-[420px] bg-[var(--color-surface)]/40 sm:min-h-[620px]">
            {invitation.coverImageUrl ? (
              <Image
                src={invitation.coverImageUrl}
                alt={invitation.title}
                fill
                priority
                sizes="(min-width: 640px) 42vw, 100vw"
                className="object-cover"
                style={{ objectPosition: `${invitation.coverImagePositionX}% ${invitation.coverImagePositionY}%` }}
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center font-display text-7xl italic text-[var(--color-accent)]/35">
                {first.charAt(0)}{second.charAt(0)}
              </div>
            )}
            <div className="absolute inset-4 border border-[var(--color-accent)]/28" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>
          <div className="flex flex-col justify-center px-7 py-12 text-left sm:px-10">
            <p className="text-[9px] tracking-[0.55em] text-[var(--color-accent)] uppercase">The Wedding Of</p>
            <h1 className="font-display mt-7 text-[clamp(3.8rem,10vw,6.5rem)] leading-[.82] text-[var(--color-gold-light)] italic">{first}</h1>
            {second && <><span className="font-display my-2 text-2xl text-[var(--color-accent)]/60 italic">&amp;</span><h1 className="font-display text-[clamp(3.8rem,10vw,6.5rem)] leading-[.82] text-[var(--color-gold-light)] italic">{second}</h1></>}
            {dateParts && <div className="mt-8 border-t border-[var(--color-accent)]/20 pt-5 text-sm text-[var(--color-ink-soft)]"><p className="uppercase tracking-[.22em] text-[var(--color-accent)]">{dateParts.weekday}, {dateParts.day} {dateParts.month} {dateParts.year}</p>{invitation.eventLocation && <p className="mt-3 font-serif italic">{invitation.eventLocation}</p>}</div>}
            <p className="mt-8 text-[9px] tracking-[.34em] text-[var(--color-accent)]/55 uppercase">{invitation.tagline || "With love & blessing"}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden px-1 py-10 text-center sm:px-8 sm:py-24">
      <div
        aria-hidden
        className="luxe-glow pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(96vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-accent)]/10"
      />
      <div
        aria-hidden
        className="luxe-glow pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(70vw,470px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--color-accent)]/12"
      />

      <div
        className="luxe-sweep luxe-variant-ornament relative w-full max-w-xl overflow-hidden border border-[var(--color-accent)]/28 px-4 py-10 backdrop-blur-[2px] sm:px-12 sm:py-16"
        style={{ background: "var(--luxe-hero-fill)", boxShadow: "var(--luxe-hero-shadow)" }}
      >
        <Corner className="left-[-1px] top-[-1px] border-l-2 border-t-2" />
        <Corner className="right-[-1px] top-[-1px] border-r-2 border-t-2" />
        <Corner className="bottom-[-1px] left-[-1px] border-b-2 border-l-2" />
        <Corner className="bottom-[-1px] right-[-1px] border-b-2 border-r-2" />

        <div className="mx-auto mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-accent)]/70 sm:w-14" />
          <span className="text-[9px] tracking-[0.55em] text-[var(--color-accent)]">✦ ✦ ✦</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-accent)]/70 sm:w-14" />
        </div>

        <p className="text-[9px] tracking-[0.62em] text-[var(--color-accent)]/80 uppercase sm:text-[10px]">
          The Wedding Of
        </p>

        {invitation.coverImageUrl && (
          <div
            className="group relative mx-auto mt-6 aspect-[4/5] w-full max-w-[238px] overflow-hidden border border-[var(--color-accent)]/30 sm:max-w-[282px]"
            style={{ boxShadow: "var(--luxe-photo-shadow)" }}
          >
            <Image
              src={invitation.coverImageUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 640px) 282px, 238px"
              className="luxe-photo object-cover opacity-95 transition-transform duration-700 group-hover:scale-[1.025]"
            style={{ objectPosition: `${invitation.coverImagePositionX}% ${invitation.coverImagePositionY}%` }}
            />
            <div className="luxe-photo-overlay absolute inset-0" />
            <div className="absolute inset-3 border border-[var(--color-accent)]/24" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-surface)]/80 to-transparent" />
          </div>
        )}

        <div className={invitation.coverImageUrl ? "relative z-10 -mt-11" : "mt-8"}>
          <h1 className="font-display px-1 text-[clamp(3rem,13vw,6.5rem)] leading-[0.88] text-[var(--color-gold-light)] italic drop-shadow-[0_5px_18px_rgba(201,162,92,0.23)]">
            {first}
          </h1>
          {second && (
            <>
              <span className="font-display my-1 block text-2xl text-[var(--color-accent)]/55 italic sm:text-3xl">&amp;</span>
              <h1 className="font-display px-1 text-[clamp(3rem,13vw,6.5rem)] leading-[0.88] text-[var(--color-gold-light)] italic drop-shadow-[0_5px_18px_rgba(201,162,92,0.23)]">
                {second}
              </h1>
            </>
          )}
        </div>

        <div className="mx-auto my-6 flex max-w-[230px] items-center gap-3 sm:my-7">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-accent)]/60" />
          <span className="size-1.5 rotate-45 bg-[var(--color-accent)]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-accent)]/60" />
        </div>

        {dateParts && (
          <div className="mx-auto grid max-w-[300px] grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] tracking-[0.32em] text-[var(--color-ink-soft)] uppercase">
                {dateParts.weekday}
              </p>
              <p className="mt-1 text-[10px] tracking-[0.22em] text-[var(--color-accent)] uppercase">
                {dateParts.month}
              </p>
            </div>
            <div className="border-x border-[var(--color-accent)]/22 px-4">
              <span className="font-display text-4xl leading-none text-[var(--color-gold-light)] italic sm:text-5xl">
                {dateParts.day}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[9px] tracking-[0.32em] text-[var(--color-ink-soft)] uppercase">
                Tahun
              </p>
              <p className="mt-1 text-[10px] tracking-[0.22em] text-[var(--color-accent)] uppercase">
                {dateParts.year}
              </p>
            </div>
          </div>
        )}

        {invitation.eventLocation && (
          <p className="mx-auto mt-5 max-w-sm font-serif text-sm leading-6 italic text-[var(--color-ink-soft)]">
            {invitation.eventLocation}
          </p>
        )}

        <p className="mt-6 text-[8px] tracking-[0.42em] text-[var(--color-accent)]/50 uppercase sm:text-[9px]">
          {invitation.tagline || "With love & blessing"}
        </p>
      </div>
    </section>
  );
}
