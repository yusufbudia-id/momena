"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";

import { useInvitationGate } from "../../hooks/use-invitation-gate";
import { useMusicToggle } from "../../hooks/use-music-toggle";
import { MusicToggle } from "../../music-toggle";
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
 * Cover gate bergaya bold/full-bleed — foto cover jadi background gelap,
 * tipografi besar huruf kapital, tombol solid (bukan outline). Beda nuansa
 * dari Elegant/Minimal, konsisten dengan karakter Modern (video-forward,
 * full-bleed) di section-nya.
 */
function CoverGate({
  invitation,
  guestName,
  onOpen,
}: SectionProps & { onOpen: () => void }) {
  const coupleName = invitation.couple
    ? `${invitation.couple.first} & ${invitation.couple.second}`
    : invitation.title;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-ink fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center text-white"
    >
      {invitation.coverImageUrl && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${invitation.coverImageUrl})` }}
        />
      )}
      <div
        aria-hidden
        className="from-ink via-ink/60 to-ink/20 absolute inset-0 bg-gradient-to-t"
      />

      <div className="relative flex flex-col items-center gap-6">
        <p className="text-xs tracking-[0.4em] text-white/70 uppercase">
          We&apos;re Getting Married
        </p>
        <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">
          {coupleName}
        </h1>

        {guestName && (
          <p className="text-sm text-white/80">
            Untuk <span className="font-medium text-white">{guestName}</span>
          </p>
        )}

        <button
          onClick={onOpen}
          className="bg-accent hover:bg-accent-ink mt-4 flex h-12 items-center px-9 text-xs tracking-[0.25em] text-white uppercase transition-colors"
        >
          Buka Undangan
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Modern: Cover Gate → Gallery → Hero → Couple → Video → Countdown →
 * Event(Location) → Quote → Gift → RSVP → Footer, full-bleed, video-forward.
 */
export function ModernTemplate({ invitation, guestName }: SectionProps) {
  const { isOpen, open } = useInvitationGate();
  const music = useMusicToggle();

  function handleOpen() {
    open();
    if (invitation.musicUrl) music.play();
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <CoverGate invitation={invitation} guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

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
          <Rsvp invitation={invitation} guestName={guestName} />
        </Reveal>
        <Footer invitation={invitation} />
      </div>

      <StickyCta invitation={invitation} />
      {invitation.musicUrl && (
        <MusicToggle
          musicUrl={invitation.musicUrl}
          audioRef={music.audioRef}
          playing={music.playing}
          onToggle={music.toggle}
        />
      )}
    </>
  );
}
