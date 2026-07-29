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
  Rsvp,
  StickyCta,
} from "../../sections";
import type { SectionProps } from "../../types";

const Countdown = dynamic(
  () => import("../../sections/Countdown").then((m) => m.Countdown),
  {
    ssr: false,
    loading: () => <div className="h-[132px] animate-pulse px-6 py-16" />,
  },
);

/**
 * Minimal: Hero → Couple → Countdown → Event(Location) → Gallery → Gift →
 * RSVP → Footer, kolom sempit. Sengaja tidak pakai Story/Quote/Video —
 * "minimal" berarti lebih sedikit ornamen, bukan cuma lebih sempit.
 */
export function MinimalTemplate({ invitation }: SectionProps) {
  return (
    <>
      <div className="mx-auto max-w-lg pb-20">
        <Hero invitation={invitation} />
        <Reveal>
          <BrideGroom invitation={invitation} />
        </Reveal>
        <Reveal>
          <Countdown invitation={invitation} />
        </Reveal>
        <Reveal>
          <Location invitation={invitation} />
        </Reveal>
        <Reveal>
          <Gallery invitation={invitation} />
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
