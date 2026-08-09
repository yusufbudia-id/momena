"use client";

import { CalendarPlus, Share2 } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

import { useInvitationGate } from "../../hooks/use-invitation-gate";
import { useMusicToggle } from "../../hooks/use-music-toggle";
import { MusicToggle } from "../../music-toggle";
import { Reveal } from "../../reveal";
import type { SectionProps } from "../../types";
import type { InvitationViewModel } from "../../view-model";

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
} from "./sections";

// Countdown butuh interval client-side — dynamic import (ssr:false) supaya
// tidak menambah bundle server & tidak memblokir render pertama.
const Countdown = dynamic(() => import("./sections/Countdown").then((m) => m.Countdown), {
  ssr: false,
  loading: () => <div className="h-[132px] animate-pulse px-6 py-16" />,
});

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
 * Elemen dekoratif & fitur khusus template ini (bukan Section — tidak
 * dipakai template lain, jadi aman ditaruh lokal di file ini).
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

/** FITUR: garis progres scroll tipis di atas layar — detail kecil yang
 * sering dipakai situs premium. */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-[var(--color-accent)]"
    />
  );
}

/** FITUR: kata sambutan (`invitation.description`) — sebelumnya diisi di
 * wizard tapi TIDAK PERNAH ditampilkan di undangan mana pun (cuma dipakai
 * untuk meta description SEO). Ditambahkan di sini dengan drop-cap klasik. */
function WelcomeNote({ invitation }: SectionProps) {
  if (!invitation.description) return null;

  return (
    <div className="mx-auto max-w-md px-6 text-center">
      <p className="first-letter:font-display text-[var(--color-ink-soft)] first-letter:float-left first-letter:mr-1.5 first-letter:text-5xl first-letter:leading-[0.8] first-letter:text-[var(--color-accent-ink)] first-letter:italic">
        {invitation.description}
      </p>
    </div>
  );
}

/** Bangun file .ics dari data invitation, dipicu lewat link download —
 * bekerja untuk Google Calendar, Apple Calendar, Outlook, dst (bukan
 * cuma satu penyedia). Asumsi durasi acara 2 jam kalau tidak ada info lain. */
function buildIcsHref(invitation: InvitationViewModel): string | null {
  if (!invitation.eventDate) return null;

  const start = invitation.eventDate;
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const toIcsDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${invitation.title}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    invitation.eventLocation ? `LOCATION:${invitation.eventLocation}` : "",
    invitation.eventAddress ? `DESCRIPTION:${invitation.eventAddress}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return `data:text/calendar;charset=utf8,${encodeURIComponent(lines)}`;
}

const utilityButtonClassName =
  "border-accent text-accent-ink flex h-10 items-center gap-2 rounded-full border px-5 text-xs tracking-wide transition-colors hover:bg-[var(--color-accent-soft)]";

/** FITUR: "Tambah ke Kalender" + "Bagikan" — dari wishlist Guest Experience
 * yang sempat dibahas tapi belum pernah dibangun. Add-to-calendar murni
 * dari data yang sudah ada, tidak butuh field baru. */
function UtilityActions({ invitation }: SectionProps) {
  const icsHref = buildIcsHref(invitation);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: invitation.title, url });
      } catch {
        // Dibatalkan user — diamkan, bukan error.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link undangan disalin ke clipboard");
  }

  return (
    <div className="my-8 flex flex-wrap items-center justify-center gap-3 px-6 sm:my-12">
      {icsHref && (
        <a href={icsHref} download="undangan.ics" className={utilityButtonClassName}>
          <CalendarPlus className="size-3.5" />
          Tambah ke Kalender
        </a>
      )}
      <button onClick={handleShare} className={utilityButtonClassName}>
        <Share2 className="size-3.5" />
        Bagikan
      </button>
    </div>
  );
}

/** FITUR: bingkai emas di sekeliling Gallery + lightbox (klik foto untuk
 * perbesar). Tidak mengubah `Gallery.tsx` sama sekali — pakai event
 * delegation (dengar klik di elemen `<img>` mana pun di dalam wrapper). */
function FramedGallery({ invitation }: SectionProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (invitation.gallery.length === 0) return null;

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.tagName === "IMG") {
      setLightboxSrc((target as HTMLImageElement).src);
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="cursor-zoom-in border border-[var(--color-line)] bg-[var(--color-surface)]/50 p-3 sm:p-5"
      >
        <Gallery invitation={invitation} />
      </div>

      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
            className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-black/90 p-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- lightbox pakai src dari elemen next/image yang diklik, bukan next/image itu sendiri */}
            <img
              src={lightboxSrc}
              alt=""
              className="max-h-full max-w-full rounded-sm object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const gatePanelVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.25 } },
} as const;

const gateContentVariants = {
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: {
    opacity: 0,
    y: -16,
    scale: 0.94,
    transition: { duration: 0.4, ease: "easeIn" },
  },
} as const;

/**
 * FITUR: Cover/gate screen — layar pembuka penuh sebelum konten undangan
 * ditampilkan. Standar di undangan digital premium Indonesia. Juga
 * berguna teknis: klik tombol ini adalah "user interaction" yang
 * dibutuhkan browser sebelum audio (`MusicToggle`) boleh diputar.
 * Menampilkan nama tamu (`guestName`, dari `?to=` di URL) kalau ada.
 *
 * Animasi keluar dua lapis (lewat variants propagation Motion): konten
 * "terangkat" & memudar duluan (0.4s, cepat), baru panel latar ikut
 * memudar sesudahnya (0.8s + delay 0.25s) — kesan amplop terbuka
 * bertahap, bukan cuma fade rata.
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
      variants={gatePanelVariants}
      initial="visible"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-hidden bg-[var(--color-paper)] px-6 text-center"
    >
      {invitation.coverImageUrl && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${invitation.coverImageUrl})` }}
        />
      )}

      <motion.div
        variants={gateContentVariants}
        className="relative flex flex-col items-center gap-6"
      >
        <p className="text-xs tracking-[0.45em] text-[var(--color-ink-soft)] uppercase">
          The Wedding Of
        </p>
        <h1 className="font-display max-w-xs text-4xl text-[var(--color-ink)] italic">
          {coupleName}
        </h1>

        {guestName && (
          <div className="mt-2">
            <p className="text-[11px] tracking-[0.3em] text-[var(--color-ink-soft)] uppercase">
              Kepada Yth.
            </p>
            <p className="font-display mt-1 text-lg text-[var(--color-accent-ink)] italic">
              {guestName}
            </p>
          </div>
        )}

        <button
          onClick={onOpen}
          className="mt-4 flex h-12 items-center justify-center rounded-full border border-[var(--color-accent)] px-9 text-xs tracking-[0.25em] text-[var(--color-accent-ink)] uppercase transition-colors hover:bg-[var(--color-accent-soft)]"
        >
          Buka Undangan
        </button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Elegant: Cover Gate → Monogram → Hero → Couple → Event(Location) →
 * Welcome Note → Utility Actions → Countdown → Gallery(+lightbox) → Story
 * → Quote → Video → Gift → RSVP → Footer.
 *
 * Gaya "old money": ivory/charcoal/gold, whitespace lega, kartu berbingkai
 * untuk section informasi resmi, ornamen bervariasi (bukan 1 motif
 * diulang), transisi fade+slide yang lambat & lembut (0.8–1s). Section
 * yang tidak punya data (mis. belum ada Quote/Video/Story) otomatis
 * menyembunyikan diri sendiri seperti biasa — bingkai di sekitarnya juga
 * ikut tidak render karena kontennya kosong.
 */
export function ElegantTemplate({ invitation, guestName }: SectionProps) {
  const { isOpen, open } = useInvitationGate();
  const music = useMusicToggle();

  function handleOpen() {
    open();
    // Klik "Buka Undangan" adalah user-gesture — momen yang tepat (dan
    // satu-satunya yang diizinkan browser) untuk autoplay musik.
    if (invitation.musicUrl) music.play();
  }

  return (
    <div
      style={luxuryTheme}
      className="bg-[var(--color-paper)] [&_h1]:tracking-wide [&_h2]:font-medium [&_h2]:tracking-wide"
    >
      <AtmosphereBackground />
      <ScrollProgressBar />

      <AnimatePresence>
        {!isOpen && (
          <CoverGate invitation={invitation} guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

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
          <WelcomeNote invitation={invitation} />
        </Reveal>

        <UtilityActions invitation={invitation} />

        <Reveal duration={0.9} distance={24} className="my-12 sm:my-16">
          <FramedCard>
            <Countdown invitation={invitation} />
          </FramedCard>
        </Reveal>

        <Reveal duration={0.9} distance={24} className="my-12 sm:my-16">
          <FramedGallery invitation={invitation} />
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
            &ldquo;
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
            <Rsvp invitation={invitation} guestName={guestName} />
          </FramedCard>
        </Reveal>

        <Ornament variant="diamond" />

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
    </div>
  );
}
