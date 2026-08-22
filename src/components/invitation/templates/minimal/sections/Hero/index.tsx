import Image from "next/image";

import type { SectionProps } from "../../../../types";

export function Hero({ invitation }: SectionProps) {
  const first = invitation.couple?.first ?? invitation.title;
  const second = invitation.couple?.second ?? "";
  const centered = invitation.settings.heroLayout === "centered";
  const formattedDate = invitation.eventDate
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(invitation.eventDate)
    : null;

  return (
    <section id="intro" className="relative px-5 pt-8 pb-20 sm:px-8 sm:pt-12 sm:pb-28">
      <div className="mx-auto max-w-[720px]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--minimal-line)] pb-4">
          <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-muted)] uppercase">
            Momena · Wedding Invitation
          </p>
          <span className="text-[9px] tracking-[0.28em] text-[var(--minimal-muted)] uppercase">
            {invitation.eventDate?.getFullYear() ?? "Wedding"}
          </span>
        </div>

        <div className={`mt-7 grid items-end gap-7 sm:gap-9 ${centered ? "mx-auto max-w-xl text-center" : "sm:grid-cols-[1.08fr_.92fr]"}`}>
          <div className={`${centered ? "order-2 mx-auto sm:pb-2" : "order-2 sm:order-1 sm:pb-5"}`}>
            <p className="text-[10px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">
              The Wedding Of
            </p>
            <div className="mt-5">
              <h1 className="font-display text-[clamp(3.8rem,14vw,7.6rem)] leading-[0.78] tracking-[-0.055em] text-[var(--minimal-ink)] italic">
                {first}
              </h1>
              {second && (
                <div className="mt-2 flex items-center gap-4 sm:mt-3">
                  <span className="h-px w-12 bg-[var(--minimal-line-strong)]" />
                  <span className="font-display text-2xl text-[var(--minimal-accent)] italic">&amp;</span>
                  <h1 className="font-display text-[clamp(3.8rem,14vw,7.6rem)] leading-[0.78] tracking-[-0.055em] text-[var(--minimal-ink)] italic">
                    {second}
                  </h1>
                </div>
              )}
            </div>

            {(formattedDate || invitation.eventLocation) && (
              <div className="mt-8 max-w-sm border-t border-[var(--minimal-line)] pt-5">
                {formattedDate && (
                  <p className="text-sm leading-6 text-[var(--minimal-ink)]">{formattedDate}</p>
                )}
                {invitation.eventLocation && (
                  <p className="mt-1 text-sm leading-6 text-[var(--minimal-muted)]">
                    {invitation.eventLocation}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className={`${centered ? "order-1 mx-auto w-full max-w-[360px]" : "order-1 sm:order-2"}`}>
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--minimal-soft)]">
              {invitation.coverImageUrl ? (
                <Image
                  src={invitation.coverImageUrl}
                  alt={invitation.title}
                  fill
                  priority
                  sizes="(min-width: 640px) 360px, 100vw"
                  className="object-cover grayscale-[12%] saturate-[.82] contrast-[.96]"
            style={{ objectPosition: `${invitation.coverImagePositionX}% ${invitation.coverImagePositionY}%` }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-6xl text-[var(--minimal-line-strong)] italic">
                    {first.charAt(0)}{second.charAt(0)}
                  </span>
                </div>
              )}
              <div style={{ opacity: "var(--momena-decoration-opacity, .75)" }} className="pointer-events-none absolute inset-3 border border-white/50 mix-blend-soft-light" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[9px] tracking-[0.24em] text-[var(--minimal-muted)] uppercase">
              <span>Portrait 01</span>
              <span>With Love</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
