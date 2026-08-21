"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";

import { useInvitationGate } from "../../hooks/use-invitation-gate";
import { useMusicToggle } from "../../hooks/use-music-toggle";
import { MusicToggle } from "../../music-toggle";
import { Reveal } from "../../reveal";
import type { SectionProps } from "../../types";

import {
  BrideGroom,
  Countdown,
  Footer,
  Gallery,
  Gift,
  Hero,
  LoveStory,
  Location,
  Rsvp,
  StickyCta,
  Video,
} from "./sections";

const minimalTheme = {
  "--minimal-paper": "#F5F3EE",
  "--minimal-surface": "#FBFAF7",
  "--minimal-ink": "#26231F",
  "--minimal-muted": "#777169",
  "--minimal-line": "#DCD7CE",
  "--minimal-line-strong": "#A9A198",
  "--minimal-soft": "#EAE6DE",
  "--minimal-accent": "#6E7569",
  "--color-paper": "#F5F3EE",
  "--color-surface": "#FBFAF7",
  "--color-ink": "#26231F",
  "--color-ink-soft": "#777169",
  "--color-line": "#DCD7CE",
  "--color-accent": "#6E7569",
  "--color-accent-soft": "#E5E8E2",
  "--color-accent-ink": "#4D554B",
} as CSSProperties;

function CoverGate({
  invitation,
  guestName,
  onOpen,
}: SectionProps & { onOpen: () => void }) {
  const first = invitation.couple?.first ?? invitation.title;
  const second = invitation.couple?.second ?? "";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--minimal-paper)] px-6"
    >
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-between border-b border-[var(--minimal-line)] pb-4 text-[8px] tracking-[0.28em] text-[var(--minimal-muted)] uppercase">
          <span>Wedding Invitation</span>
          <span>Momena</span>
        </div>

        <p className="mt-14 text-[9px] tracking-[0.35em] text-[var(--minimal-accent)] uppercase">The Wedding Of</p>
        <h1 className="font-display mt-6 text-[clamp(4rem,16vw,6rem)] leading-[0.82] tracking-[-0.055em] text-[var(--minimal-ink)] italic">
          {first}
        </h1>
        {second && (
          <>
            <span className="font-display my-2 block text-2xl text-[var(--minimal-accent)] italic">&amp;</span>
            <h1 className="font-display text-[clamp(4rem,16vw,6rem)] leading-[0.82] tracking-[-0.055em] text-[var(--minimal-ink)] italic">
              {second}
            </h1>
          </>
        )}

        <div className="mx-auto mt-10 max-w-xs border-t border-[var(--minimal-line)] pt-6">
          <p className="text-[9px] tracking-[0.24em] text-[var(--minimal-muted)] uppercase">Kepada Yth.</p>
          <p className="mt-2 text-sm text-[var(--minimal-ink)]">{guestName || "Tamu Undangan"}</p>
        </div>

        <button
          onClick={onOpen}
          className="group mx-auto mt-10 inline-flex items-center gap-3 border-b border-[var(--minimal-ink)] pb-2 text-[10px] tracking-[0.24em] text-[var(--minimal-ink)] uppercase"
        >
          Buka Undangan
          <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-1" strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
}

function IntroNote({ invitation }: SectionProps) {
  if (!invitation.description) return null;
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[620px] text-center">
        <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">Invitation</p>
        <p className="font-display mt-5 text-xl leading-9 text-[var(--minimal-ink)] italic sm:text-2xl sm:leading-10">
          {invitation.description}
        </p>
      </div>
    </section>
  );
}

export function MinimalTemplate({ invitation, guestName }: SectionProps) {
  const { isOpen, open } = useInvitationGate();
  const music = useMusicToggle();

  function handleOpen() {
    open();
    if (invitation.musicUrl) music.play();
  }

  const themeStyle = {
    ...minimalTheme,
    ...(invitation.settings.accentColor
      ? { "--minimal-accent": invitation.settings.accentColor, "--color-accent": invitation.settings.accentColor }
      : {}),
  } as CSSProperties;

  return (
    <div style={themeStyle} className="min-h-screen bg-[var(--minimal-paper)] text-[var(--minimal-ink)] selection:bg-[var(--minimal-soft)]">
      <AnimatePresence>
        {!isOpen && <CoverGate invitation={invitation} guestName={guestName} onOpen={handleOpen} />}
      </AnimatePresence>

      <main className="overflow-hidden">
        <Hero invitation={invitation} />
        <Reveal duration={0.75} distance={18}><IntroNote invitation={invitation} /></Reveal>
        <Reveal duration={0.75} distance={18}><BrideGroom invitation={invitation} /></Reveal>
        <Reveal duration={0.75} distance={18}><Countdown invitation={invitation} /></Reveal>
        <Reveal duration={0.75} distance={18}><Location invitation={invitation} /></Reveal>
        {invitation.settings.showGallery && <Reveal duration={0.75} distance={18}><Gallery invitation={invitation} /></Reveal>}
        {invitation.settings.showStory && <Reveal duration={0.75} distance={18}><LoveStory invitation={invitation} /></Reveal>}
        {invitation.settings.showVideo && <Reveal duration={0.75} distance={18}><Video invitation={invitation} /></Reveal>}
        {invitation.settings.showGift && <Reveal duration={0.75} distance={18}><Gift invitation={invitation} /></Reveal>}
        {invitation.settings.showRsvp && <Reveal duration={0.75} distance={18}><Rsvp invitation={invitation} guestName={guestName} /></Reveal>}
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
