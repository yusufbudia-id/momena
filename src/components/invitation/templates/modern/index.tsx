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
  Quote,
  Rsvp,
  StickyCta,
  Video,
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
 * Modern: Gallery → Hero → Couple → Video → Countdown → Event(Location) →
 * Quote → Gift → RSVP → Footer, full-bleed, video-forward.
 */
export function ModernTemplate({ invitation }: SectionProps) {
  return (
    <>
      <div className="mx-auto max-w-4xl pb-20">
        <Gallery invitation={invitation} />
        <Hero invitation={invitation} />
        <Reveal>
          <BrideGroom invitation={invitation} />
        </Reveal>
        <Reveal>
          <Video invitation={invitation} />
        </Reveal>
        <Reveal>
          <Countdown invitation={invitation} />
        </Reveal>
        <Reveal>
          <Location invitation={invitation} />
        </Reveal>
        <Reveal>
          <Quote invitation={invitation} />
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
