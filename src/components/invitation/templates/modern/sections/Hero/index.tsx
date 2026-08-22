import Image from "next/image";

import type { SectionProps } from "../../../../types";

export function Hero({ invitation }: SectionProps) {
  const first = invitation.couple?.first ?? invitation.title;
  const second = invitation.couple?.second ?? "";
  const centered = invitation.settings.heroLayout === "centered";
  const date = invitation.eventDate;
  const day = date ? new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(date) : "";
  const month = date ? new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date) : "";
  const year = date ? new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(date) : "";

  return (
    <section className="relative min-h-svh overflow-hidden bg-[#090b11] text-white">
      <div className={`absolute inset-y-0 right-0 ${centered ? "w-full opacity-45" : "w-[74%] sm:w-[66%] lg:w-[58%]"}`}>
        {invitation.coverImageUrl && (
          <Image
            src={invitation.coverImageUrl}
            alt=""
            fill
            priority
            sizes="(min-width:1024px) 58vw, 74vw"
            className="object-cover"
            style={{ objectPosition: `${invitation.coverImagePositionX}% ${invitation.coverImagePositionY}%` }}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#090b11_0%,rgba(9,11,17,.12)_45%,rgba(9,11,17,.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(9,11,17,.72)_100%)]" />
      </div>

      <div style={{ opacity: "var(--momena-decoration-opacity, .75)" }} className="absolute left-[12%] top-[18%] size-32 rounded-full bg-[var(--modern-violet)]/30 blur-3xl sm:size-48" />
      <div style={{ opacity: "var(--momena-decoration-opacity, .75)" }} className="absolute bottom-[16%] right-[12%] size-32 rounded-full bg-[#ff5f9f]/25 blur-3xl sm:size-52" />

      <div className="relative mx-auto flex min-h-svh max-w-[1500px] flex-col justify-between px-5 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between border-b border-white/12 pb-4 text-[9px] tracking-[.3em] text-white/45 uppercase">
          <span>Wedding invitation</span>
          <span>Modern / 03</span>
        </div>

        <div className={`grid items-end gap-8 pb-8 lg:pb-12 ${centered ? "mx-auto max-w-5xl text-center" : "lg:grid-cols-[1fr_auto]"}`}>
          <div className={`relative z-10 ${centered ? "mx-auto" : ""}`}>
            <p className="mb-4 text-[10px] font-semibold tracking-[.35em] text-[#d8ff58] uppercase">
              Contemporary love story
            </p>
            <h1 className={`max-w-5xl text-[clamp(5rem,18vw,12rem)] font-black leading-[.7] tracking-[-.085em] uppercase mix-blend-normal ${centered ? "mx-auto" : ""}`}>
              <span className="block">{first}</span>
              {second && (
                <span className="block translate-x-[8vw] text-white/34 sm:translate-x-[5vw]">
                  × {second}
                </span>
              )}
            </h1>
            {invitation.tagline && (
              <p className="mt-7 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
                {invitation.tagline}
              </p>
            )}
          </div>

          {date && (
            <div className={`relative z-10 grid w-fit grid-cols-[auto_auto] items-end gap-4 border-l border-white/14 bg-black/10 pl-5 backdrop-blur-[2px] sm:pl-7 ${centered ? "mx-auto border-l-0 pl-0 sm:pl-0" : ""}`}>
              <span className="text-[clamp(5rem,14vw,9rem)] font-black leading-[.72] tracking-[-.08em] text-[#ff5f9f]">
                {day}
              </span>
              <div className="pb-1">
                <p className="text-[10px] font-black tracking-[.24em] text-[#d8ff58] uppercase">
                  {month}
                </p>
                <p className="mt-1 text-sm font-semibold tracking-[.16em] text-white/72">{year}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
