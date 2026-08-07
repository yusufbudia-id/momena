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
 * Cover gate bergaya minimal — tanpa ornamen, tombol cukup garis bawah
 * tipis. "Minimal" artinya elemen dikurangi, bukan cuma dikecilkan.
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
      transition={{ duration: 0.5 }}
      className="bg-paper fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">
        Undangan Pernikahan
      </p>
      <h1 className="font-display text-ink text-3xl italic">{coupleName}</h1>

      {guestName && (
        <p className="text-ink-soft text-sm">
          Kepada <span className="text-ink font-medium">{guestName}</span>
        </p>
      )}

      <button
        onClick={onOpen}
        className="border-ink text-ink flex h-11 items-center border-b px-1 text-sm tracking-wide"
      >
        Buka Undangan
      </button>
    </motion.div>
  );
}

/**
 * Minimal: Cover Gate → Hero → Couple → Countdown → Event(Location) →
 * Gallery → Gift → RSVP → Footer, kolom sempit. Sengaja tidak pakai
 * Story/Quote/Video — "minimal" berarti lebih sedikit ornamen, bukan cuma
 * lebih sempit.
 */
export function MinimalTemplate({ invitation, guestName }: SectionProps) {
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
