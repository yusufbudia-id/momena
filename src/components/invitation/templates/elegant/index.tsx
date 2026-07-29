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
 * Elegant: Hero → Couple → Event(Location) → Countdown → Gallery → Story →
 * Quote → Video → Gift → RSVP → Footer. Section yang tidak punya data
 * (mis. belum ada Quote/Video/Story) otomatis menyembunyikan diri sendiri.
 */
export function ElegantTemplate({ invitation }: SectionProps) {
  return (
    <>
      <div className="mx-auto max-w-2xl pb-20">
        <Hero invitation={invitation} />
        <Reveal>
          <BrideGroom invitation={invitation} />
        </Reveal>
        <Reveal>
          <Location invitation={invitation} />
        </Reveal>
        <Reveal>
          <Countdown invitation={invitation} />
        </Reveal>
        <Reveal>
          <Gallery invitation={invitation} />
        </Reveal>
        <Reveal>
          <LoveStory invitation={invitation} />
        </Reveal>
        <Reveal>
          <Quote invitation={invitation} />
        </Reveal>
        <Reveal>
          <Video invitation={invitation} />
        </Reveal>
        <Reveal>
          <Gift invitation={invitation} />
        </Reveal>
        <Reveal>
          <Rsvp invitation={invitation} />
        </Reveal>
        <Footer invitation={invitation} />
      </div>
      <StickyCta invitation={invitation} />
    </>
  );
}
