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

/** Garis ornamen emas tipis — penanda transisi antar section, dipakai secukupnya. */
function OrnamentDivider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3 py-1">
      <span className="h-px w-10 bg-[var(--color-accent)]/40 sm:w-16" />
      <span className="size-1.5 rotate-45 bg-[var(--color-accent)]" />
      <span className="h-px w-10 bg-[var(--color-accent)]/40 sm:w-16" />
    </div>
  );
}

/**
 * Elegant: Hero → Couple → Event(Location) → Countdown → Gallery → Story →
 * Quote → Video → Gift → RSVP → Footer.
 *
 * Gaya "old money": ivory/charcoal/gold, whitespace lega, transisi
 * fade+slide yang lambat & lembut (0.8–1s, bukan 0.5s standar). Section
 * yang tidak punya data (mis. belum ada Quote/Video/Story) otomatis
 * menyembunyikan diri sendiri seperti biasa.
 */
export function ElegantTemplate({ invitation }: SectionProps) {
  return (
    <div
      style={luxuryTheme}
      className="bg-[var(--color-paper)] [&_h1]:tracking-wide [&_h2]:font-medium [&_h2]:tracking-wide"
    >
      {/* Vignette lembut di belakang Hero — murni dekoratif */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-accent-soft)_0%,_transparent_60%)] opacity-60"
      />

      <div className="mx-auto max-w-2xl pb-28">
        <Hero invitation={invitation} />

        <div className="my-4 sm:my-8">
          <OrnamentDivider />
        </div>

        <Reveal duration={0.9} distance={24} className="my-10 sm:my-16">
          <BrideGroom invitation={invitation} />
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-10 sm:my-16">
          <Location invitation={invitation} />
        </Reveal>

        <div className="my-4 sm:my-8">
          <OrnamentDivider />
        </div>

        <Reveal duration={0.9} distance={24} className="my-10 sm:my-16">
          <Countdown invitation={invitation} />
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-10 sm:my-16">
          <Gallery invitation={invitation} />
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-10 sm:my-16">
          <LoveStory invitation={invitation} />
        </Reveal>

        <Reveal duration={1} distance={20} className="my-10 sm:my-16">
          <Quote invitation={invitation} />
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-10 sm:my-16">
          <Video invitation={invitation} />
        </Reveal>

        <div className="my-4 sm:my-8">
          <OrnamentDivider />
        </div>

        <Reveal duration={0.9} distance={24} className="my-10 sm:my-16">
          <Gift invitation={invitation} />
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-10 sm:my-16">
          <Rsvp invitation={invitation} />
        </Reveal>

        <div className="my-4 sm:my-8">
          <OrnamentDivider />
        </div>

        <Footer invitation={invitation} />
      </div>

      <StickyCta invitation={invitation} />
    </div>
  );
}
