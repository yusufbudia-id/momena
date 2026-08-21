"use client";

import { AnimatePresence, motion, useScroll } from "motion/react";

import { useInvitationGate } from "../../hooks/use-invitation-gate";
import { useMusicToggle } from "../../hooks/use-music-toggle";
import { MusicToggle } from "../../music-toggle";
import type { SectionProps } from "../../types";
import {
  BrideGroom,
  Countdown,
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
} from "./sections";

const modernTheme = {
  "--color-paper": "#f1f0ec",
  "--color-surface": "#ffffff",
  "--color-ink": "#0c0e14",
  "--color-ink-soft": "#6c707c",
  "--color-line": "#d8d7d2",
  "--color-accent": "#765cff",
  "--color-accent-soft": "#eae5ff",
  "--color-accent-ink": "#5037dc",
  "--modern-pink": "#ff5f9f",
  "--modern-violet": "#765cff",
  "--modern-lime": "#d8ff58",
} as React.CSSProperties;

function Progress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-[linear-gradient(90deg,var(--modern-violet),#ff5f9f,#d8ff58)]"
    />
  );
}

function CoverGate({
  invitation,
  guestName,
  onOpen,
}: SectionProps & { onOpen: () => void }) {
  const first = invitation.couple?.first ?? invitation.title;
  const second = invitation.couple?.second ?? "";

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#090b11] text-white"
    >
      {invitation.coverImageUrl && (
        <div
          className="absolute inset-0 scale-[1.03] bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url(${invitation.coverImageUrl})`,
            backgroundPosition: `${invitation.coverImagePositionX}% ${invitation.coverImagePositionY}%`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,.12),rgba(5,6,10,.92))]" />
      <div className="absolute -right-16 top-20 h-48 w-48 rounded-full bg-[var(--modern-violet)]/35 blur-3xl" />
      <div className="absolute -left-12 bottom-24 h-44 w-44 rounded-full bg-[#ff5f9f]/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-svh max-w-[1500px] flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 text-[9px] tracking-[.32em] text-white/52 uppercase">
          <span>Momena / Modern 03</span>
          <span>Digital editorial invitation</span>
        </div>

        <div className="grid items-end gap-8 pb-3 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            <p className="text-[10px] font-semibold tracking-[.38em] text-[#d0c6ff] uppercase">
              You&apos;re invited
            </p>
            <h1 className="mt-4 max-w-5xl text-[clamp(4.6rem,18vw,12rem)] font-black leading-[.72] tracking-[-.08em] uppercase">
              <span className="block">{first}</span>
              {second && (
                <span className="block translate-x-[7vw] text-white/34 sm:translate-x-[4vw]">
                  × {second}
                </span>
              )}
            </h1>
          </div>

          <div className="max-w-xs border-l border-white/16 pl-5 lg:mb-3">
            <p className="text-xs leading-6 text-white/48">
              A wedding invitation designed as a digital story, made for the screen.
            </p>
            {guestName && (
              <p className="mt-4 text-[10px] tracking-[.18em] text-white/58 uppercase">
                Reserved for <span className="text-white">{guestName}</span>
              </p>
            )}
            <button
              onClick={onOpen}
              className="group mt-6 flex h-12 w-full items-center justify-between bg-[#d8ff58] px-5 text-[10px] font-black tracking-[.24em] text-[#0b0d12] uppercase transition hover:bg-[#ff5f9f]"
            >
              <span>Enter experience</span>
              <span className="text-base transition group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Interlude({ label, number }: { label: string; number: string }) {
  return (
    <div className="bg-[#0b0d13] px-5 py-5 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between border-y border-white/10 py-3 text-[9px] tracking-[.32em] text-white/35 uppercase">
        <span>{label}</span>
        <span>{number}</span>
      </div>
    </div>
  );
}

export function ModernTemplate({ invitation, guestName }: SectionProps) {
  const { isOpen, open } = useInvitationGate();
  const music = useMusicToggle();

  function handleOpen() {
    open();
    if (invitation.musicUrl) music.play();
  }

  const themeStyle = {
    ...modernTheme,
    ...(invitation.settings.accentColor
      ? { "--color-accent": invitation.settings.accentColor, "--modern-violet": invitation.settings.accentColor }
      : {}),
  } as React.CSSProperties;

  return (
    <div
      style={themeStyle}
      className="min-h-screen overflow-x-hidden bg-[#0b0d13] font-sans text-white selection:bg-[#d8ff58] selection:text-[#101218]"
    >
      <Progress />
      <AnimatePresence>
        {!isOpen && (
          <CoverGate invitation={invitation} guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      <main>
        <Hero invitation={invitation} />
        <Interlude label="Meet the couple" number="01" />
        <BrideGroom invitation={invitation} />
        {invitation.settings.showGallery && (<>
          <Interlude label="Visual diary" number="02" />
          <Gallery invitation={invitation} />
        </>)}
        <Countdown invitation={invitation} />
        <Location invitation={invitation} />
        {invitation.settings.showStory && <LoveStory invitation={invitation} />}
        <Quote invitation={invitation} />
        {invitation.settings.showVideo && <Video invitation={invitation} />}
        {invitation.settings.showGift && <Gift invitation={invitation} />}
        {invitation.settings.showRsvp && <Rsvp invitation={invitation} guestName={guestName} />}
        <Footer invitation={invitation} />
      </main>

      {invitation.settings.showRsvp && <StickyCta invitation={invitation} />}
      {invitation.musicUrl && (
        <MusicToggle
          musicUrl={invitation.musicUrl}
          audioRef={music.audioRef}
          playing={music.playing}
          onToggle={music.toggle}
        />
      )}
    </div>
  );
}
