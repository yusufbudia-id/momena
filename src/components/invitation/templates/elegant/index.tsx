"use client";

import dynamic from "next/dynamic";

import { Reveal } from "../../reveal";
import {
  BrideGroom,
  Footer,
  Gallery,
  Gift,
  Hero,
  Location,
  LoveStory,
  Quote,
  Rsvp,
  StickyCta,
  Video,
} from "../../sections";
import type { SectionProps } from "../../types";

// Countdown butuh interval client-side — dynamic import (ssr:false) supaya
// tidak menambah bundle server & tidak memblokir render pertama.
const Countdown = dynamic(
  () => import("../../sections/Countdown").then((m) => m.Countdown),
  {
    ssr: false,
    loading: () => <div className="h-[132px] animate-pulse px-6 py-16" />,
  },
);

/**
 * Palet "old money" khusus Elegant — ivory/cream, charcoal, gold redup.
 * Dipasang sebagai CSS custom property di wrapper, BUKAN diubah di token
 * global (`globals.css`) — supaya Minimal/Modern tetap pakai palet standar.
 * Semua section (Hero, BrideGroom, dst) sudah dibangun pakai class seperti
 * `bg-paper`/`text-ink`/`bg-accent` yang resolve ke `var(--color-*)`, jadi
 * override di sini otomatis "menembus" tanpa section-nya perlu diubah.
 */
const luxuryTheme = {
  "--color-paper": "#fbf9f5",
  "--color-surface": "#fffefb",
  "--color-ink": "#2c2c2c",
  "--color-ink-soft": "#6f6a62",
  "--color-line": "#e8e1d0",
  "--color-accent": "#c5a059",
  "--color-accent-soft": "#f3ead4",
  "--color-accent-ink": "#9c7c3e",
} as React.CSSProperties;

/* ────────────────────────────────────────────────────────────────
 * Elemen dekoratif khusus template ini (bukan Section — tidak dipakai
 * template lain, jadi aman ditaruh lokal di file ini).
 * ──────────────────────────────────────────────────────────────── */

/** Sprig daun kecil — dipakai berpasangan (cermin) di ornamen "laurel". */
function LeafSprig({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="30"
      height="12"
      viewBox="0 0 30 12"
      fill="none"
      aria-hidden
      className={flip ? "-scale-x-100" : ""}
    >
      <path
        d="M0 6C7 0 16 0 22 3.2C25.5 5 28.5 6 30 6C28.5 6 25.5 7 22 8.8C16 12 7 12 0 6Z"
        fill="var(--color-accent)"
        fillOpacity="0.55"
      />
    </svg>
  );
}

/** Garis/ornamen pemisah antar section. Tiga motif dipakai bergantian
 * supaya tidak monoton kalau diulang banyak kali di satu halaman. */
function Ornament({ variant = "diamond" }: { variant?: "diamond" | "laurel" | "line" }) {
  if (variant === "line") {
    return (
      <div
        aria-hidden
        className="mx-auto my-8 h-px w-20 bg-[var(--color-line)] sm:my-12"
      />
    );
  }

  if (variant === "laurel") {
    return (
      <div aria-hidden className="my-8 flex items-center justify-center gap-2 sm:my-12">
        <LeafSprig />
        <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
        <LeafSprig flip />
      </div>
    );
  }

  return (
    <div aria-hidden className="my-8 flex items-center justify-center gap-3 sm:my-12">
      <span className="h-px w-10 bg-[var(--color-accent)]/40 sm:w-16" />
      <span className="size-1.5 rotate-45 bg-[var(--color-accent)]" />
      <span className="h-px w-10 bg-[var(--color-accent)]/40 sm:w-16" />
    </div>
  );
}

/** Bracket kecil di keempat sudut kartu — kesan "kartu undangan resmi". */
function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M0 0H18M0 0V18" stroke="var(--color-accent)" strokeWidth="1.25" />
    </svg>
  );
}

/** Kartu berbingkai hairline emas + sudut bracket — dipakai untuk section
 * yang sifatnya "informasi resmi" (Couple, Countdown, Gift, RSVP). */
function FramedCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative border border-[var(--color-line)] bg-[var(--color-surface)]/70 px-6 py-10 sm:px-12 sm:py-14 ${className}`}
    >
      <CornerMark className="absolute -top-px -left-px" />
      <CornerMark className="absolute -top-px -right-px rotate-90" />
      <CornerMark className="absolute -bottom-px -left-px -rotate-90" />
      <CornerMark className="absolute -right-px -bottom-px rotate-180" />
      {children}
    </div>
  );
}

/** Pembuka ala kop surat undangan resmi — monogram inisial mempelai +
 * eyebrow "The Wedding Of". Muncul sebelum Hero, murni dekoratif. */
function MonogramHeader({ invitation }: SectionProps) {
  const initials = invitation.couple
    ? `${invitation.couple.first.charAt(0)}${invitation.couple.second.charAt(0)}`.toUpperCase()
    : null;

  return (
    <div className="flex flex-col items-center gap-5 px-6 pt-16 text-center">
      <p className="text-xs tracking-[0.45em] text-[var(--color-ink-soft)] uppercase">
        The Wedding Of
      </p>
      <div className="relative flex size-20 items-center justify-center rounded-full border border-[var(--color-accent)]">
        <div className="absolute inset-1.5 rounded-full border border-[var(--color-accent)]/40" />
        <span className="font-display text-2xl text-[var(--color-accent-ink)] italic">
          {initials ?? "❦"}
        </span>
      </div>
    </div>
  );
}

/** Latar bertekstur dot-grid sangat halus + vignette gold lembut — kesan
 * kertas premium, bukan warna flat polos. */
function AtmosphereBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-accent) 0.6px, transparent 0.6px)",
          backgroundSize: "26px 26px",
          opacity: 0.07,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-accent-soft)_0%,_transparent_60%)] opacity-70"
      />
    </>
  );
}

/**
 * Elegant: Monogram → Hero → Couple → Event(Location) → Countdown →
 * Gallery → Story → Quote → Video → Gift → RSVP → Footer.
 *
 * Gaya "old money": ivory/charcoal/gold, whitespace lega, kartu berbingkai
 * untuk section informasi resmi, ornamen bervariasi (bukan 1 motif
 * diulang), transisi fade+slide yang lambat & lembut (0.8–1s). Section
 * yang tidak punya data (mis. belum ada Quote/Video/Story) otomatis
 * menyembunyikan diri sendiri seperti biasa — bingkai di sekitarnya juga
 * ikut tidak render karena kontennya kosong.
 */
export function ElegantTemplate({ invitation }: SectionProps) {
  return (
    <div
      style={luxuryTheme}
      className="bg-[var(--color-paper)] [&_h1]:tracking-wide [&_h2]:font-medium [&_h2]:tracking-wide"
    >
      <AtmosphereBackground />

      <div className="mx-auto max-w-2xl pb-28">
        <MonogramHeader invitation={invitation} />
        <Hero invitation={invitation} />

        <Ornament variant="laurel" />

        <Reveal duration={0.9} distance={24}>
          <FramedCard>
            <BrideGroom invitation={invitation} />
            <Ornament variant="line" />
            <Location invitation={invitation} />
          </FramedCard>
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-12 sm:my-16">
          <FramedCard>
            <Countdown invitation={invitation} />
          </FramedCard>
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-12 sm:my-16">
          <Gallery invitation={invitation} />
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-12 sm:my-16">
          <LoveStory invitation={invitation} />
        </Reveal>

        <Ornament variant="diamond" />

        <Reveal duration={1} distance={20} className="relative">
          <span
            aria-hidden
            className="font-display pointer-events-none absolute inset-x-0 -top-10 text-center text-[9rem] leading-none text-[var(--color-accent)]/15 italic select-none"
          >
            “
          </span>
          <Quote invitation={invitation} />
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-12 sm:my-16">
          <Video invitation={invitation} />
        </Reveal>

        <Ornament variant="laurel" />

        <Reveal duration={0.9} distance={24}>
          <FramedCard>
            <Gift invitation={invitation} />
          </FramedCard>
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-12 sm:my-16">
          <FramedCard>
            <Rsvp invitation={invitation} />
          </FramedCard>
        </Reveal>

        <Ornament variant="diamond" />

        <Footer invitation={invitation} />
      </div>

      <StickyCta invitation={invitation} />
    </div>
  );
}
