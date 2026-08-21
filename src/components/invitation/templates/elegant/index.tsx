"use client";

import { CalendarPlus, ChevronLeft, ChevronRight, Share2, X } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
 * Palet dark ceremonial luxury khusus Elegant — charcoal, black, gold redup.
 * Dipasang sebagai CSS custom property di wrapper, BUKAN diubah di token
 * global (`globals.css`) — supaya Minimal/Modern tetap pakai palet standar.
 * Semua section (Hero, BrideGroom, dst) sudah dibangun pakai class seperti
 * `bg-paper`/`text-ink`/`bg-accent` yang resolve ke `var(--color-*)`, jadi
 * override di sini otomatis "menembus" tanpa section-nya perlu diubah.
 */
type ElegantVariant = "noir" | "ivory";

const elegantThemes: Record<ElegantVariant, React.CSSProperties> = {
  noir: {
    "--color-paper": "#070706",
    "--color-surface": "#0d0c09",
    "--color-ink": "#f4ecd9",
    "--color-ink-soft": "#b9ad94",
    "--color-line": "#2d281d",
    "--color-accent": "#c9a25c",
    "--color-accent-soft": "#211b10",
    "--color-accent-ink": "#e1c27d",
    "--color-gold-light": "#f0d894",
    "--luxe-base": "#060605",
    "--luxe-button-ink": "#080706",
    "--luxe-gate": "#050504",
    "--luxe-curtain-a": "#080806",
    "--luxe-curtain-b": "#151006",
    "--luxe-sticky": "rgba(10,9,7,.92)",
    "--luxe-hero-fill": "linear-gradient(180deg,rgba(201,162,92,.065),rgba(13,12,9,.61)_32%,rgba(13,12,9,.48))",
    "--luxe-hero-shadow": "0 0 0 5px rgba(201,162,92,.025),0 0 0 6px rgba(201,162,92,.09),0 34px 130px rgba(0,0,0,.56),inset 0 0 90px rgba(0,0,0,.28)",
    "--luxe-frame-fill": "linear-gradient(180deg,rgba(201,162,92,.045),rgba(13,12,9,.74)_34%,rgba(13,12,9,.68))",
    "--luxe-card-shadow": "inset 0 0 70px rgba(201,162,92,.035),0 24px 90px rgba(0,0,0,.26)",
    "--luxe-photo-shadow": "0 24px 70px rgba(0,0,0,.38)",
    "--luxe-gallery-shadow": "0 24px 90px rgba(0,0,0,.22)",
    "--luxe-control-bg": "rgba(0,0,0,.42)",
    "--luxe-lightbox": "rgba(3,3,2,.96)",
    "--luxe-photo-overlay": "linear-gradient(to top,rgba(0,0,0,.72),transparent 58%,rgba(0,0,0,.12))",
    "--luxe-gallery-overlay": "linear-gradient(to top,rgba(0,0,0,.84),rgba(0,0,0,.05),transparent)",
    "--luxe-caption": "rgba(255,255,255,.92)",
    "--luxe-paper-grain": "0",
  } as React.CSSProperties,
  ivory: {
    "--color-paper": "#f6f0e4",
    "--color-surface": "#fffaf0",
    "--color-ink": "#30281f",
    "--color-ink-soft": "#766a59",
    "--color-line": "#d9c8aa",
    "--color-accent": "#a77b32",
    "--color-accent-soft": "#ecdfc6",
    "--color-accent-ink": "#7c5925",
    "--color-gold-light": "#9b702d",
    "--luxe-base": "#f3ecdf",
    "--luxe-button-ink": "#fffaf0",
    "--luxe-gate": "#eee3d0",
    "--luxe-curtain-a": "#f3eadb",
    "--luxe-curtain-b": "#dfcfb2",
    "--luxe-sticky": "rgba(248,241,228,.94)",
    "--luxe-hero-fill": "linear-gradient(180deg,rgba(255,251,243,.94),rgba(248,239,223,.90))",
    "--luxe-hero-shadow": "0 0 0 5px rgba(167,123,50,.035),0 0 0 6px rgba(167,123,50,.10),0 30px 90px rgba(91,66,34,.16),inset 0 0 80px rgba(167,123,50,.035)",
    "--luxe-frame-fill": "linear-gradient(180deg,rgba(255,250,240,.92),rgba(250,243,230,.88))",
    "--luxe-card-shadow": "inset 0 0 70px rgba(167,123,50,.035),0 22px 70px rgba(95,70,35,.12)",
    "--luxe-photo-shadow": "0 22px 62px rgba(91,66,34,.18)",
    "--luxe-gallery-shadow": "0 22px 70px rgba(91,66,34,.14)",
    "--luxe-control-bg": "rgba(255,250,240,.78)",
    "--luxe-lightbox": "rgba(36,29,20,.94)",
    "--luxe-photo-overlay": "linear-gradient(to top,rgba(48,40,31,.42),transparent 62%,rgba(255,250,240,.08))",
    "--luxe-gallery-overlay": "linear-gradient(to top,rgba(45,35,24,.64),rgba(45,35,24,.03),transparent)",
    "--luxe-caption": "rgba(255,251,243,.96)",
    "--luxe-paper-grain": "1",
  } as React.CSSProperties,
};

/* ────────────────────────────────────────────────────────────────
 * Elemen dekoratif & fitur khusus template ini (bukan Section — tidak
 * dipakai template lain, jadi aman ditaruh lokal di file ini).
 * ──────────────────────────────────────────────────────────────── */


function LuxuryRuntimeStyles() {
  return (
    <style>{`
      .momena-luxe {
        text-rendering: geometricPrecision;
      }

      .momena-luxe::selection {
        background: rgba(201, 162, 92, .28);
      }

      @keyframes luxeFloat {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: .28; }
        50% { transform: translate3d(0, -18px, 0) scale(1.06); opacity: .55; }
      }

      @keyframes luxeGlow {
        0%, 100% { opacity: .22; filter: blur(0px); }
        50% { opacity: .45; filter: blur(1px); }
      }

      @keyframes luxeSweep {
        0% { transform: translateX(-110%); opacity: 0; }
        18% { opacity: .55; }
        52% { opacity: .18; }
        100% { transform: translateX(110%); opacity: 0; }
      }

      .momena-luxe .luxe-section {
        position: relative;
        isolation: isolate;
      }

      .momena-luxe .luxe-section::before {
        content: "";
        position: absolute;
        inset-inline: 12%;
        top: -1px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(201,162,92,.13), transparent);
        pointer-events: none;
      }

      @media (max-width: 639px) {
        .momena-luxe {
          -webkit-tap-highlight-color: transparent;
        }
        .momena-luxe .luxe-mobile-edge {
          margin-inline: -0.35rem;
        }
      }

      .momena-luxe[data-elegant-variant="noir"] .luxe-variant-ornament::before,
      .momena-luxe[data-elegant-variant="noir"] .luxe-variant-ornament::after {
        content: "✦";
        position: absolute;
        color: var(--color-accent);
        opacity: .22;
        font-size: .7rem;
        letter-spacing: .3em;
        pointer-events: none;
      }

      .momena-luxe[data-elegant-variant="noir"] .luxe-variant-ornament::before {
        top: 1rem;
        left: 1rem;
      }

      .momena-luxe[data-elegant-variant="noir"] .luxe-variant-ornament::after {
        right: 1rem;
        bottom: 1rem;
        transform: rotate(180deg);
      }

      .momena-luxe[data-elegant-variant="ivory"] .luxe-variant-ornament::before,
      .momena-luxe[data-elegant-variant="ivory"] .luxe-variant-ornament::after {
        content: "";
        position: absolute;
        width: 5rem;
        height: 5rem;
        opacity: .34;
        pointer-events: none;
        background:
          radial-gradient(ellipse at 18% 82%, transparent 0 44%, rgba(167,123,50,.45) 45% 46%, transparent 47%),
          radial-gradient(ellipse at 44% 62%, transparent 0 42%, rgba(167,123,50,.35) 43% 44%, transparent 45%),
          linear-gradient(135deg, transparent 48.8%, rgba(167,123,50,.35) 49% 50%, transparent 50.2%);
      }

      .momena-luxe[data-elegant-variant="ivory"] .luxe-variant-ornament::before {
        top: .8rem;
        left: .8rem;
      }

      .momena-luxe[data-elegant-variant="ivory"] .luxe-variant-ornament::after {
        right: .8rem;
        bottom: .8rem;
        transform: rotate(180deg);
      }

      .momena-luxe[data-elegant-variant="ivory"] .luxe-photo {
        filter: sepia(.08) saturate(.88) contrast(.98);
      }

      .momena-luxe[data-elegant-variant="noir"] .luxe-photo {
        filter: grayscale(.1) contrast(1.035);
      }

      .momena-luxe .luxe-photo-overlay {
        background: var(--luxe-photo-overlay);
      }

      .momena-luxe .luxe-gallery-overlay {
        background: var(--luxe-gallery-overlay);
      }

      .momena-luxe [aria-label="Tutup galeri"],
      .momena-luxe [aria-label="Foto sebelumnya"],
      .momena-luxe [aria-label="Foto berikutnya"] {
        background: var(--luxe-control-bg);
      }

      .momena-luxe .luxe-card-fill {
        background: var(--luxe-frame-fill);
        box-shadow: var(--luxe-card-shadow);
      }

      .momena-luxe[data-elegant-variant="ivory"] .luxe-paper {
        background-image:
          radial-gradient(circle at 22% 20%, rgba(167,123,50,.055) 0 1px, transparent 1.2px),
          radial-gradient(circle at 72% 66%, rgba(167,123,50,.04) 0 1px, transparent 1.2px);
        background-size: 22px 22px, 31px 31px;
      }

      .momena-luxe[data-elegant-variant="ivory"] .luxe-curtain-panel {
        box-shadow: none !important;
      }

      .momena-luxe[data-elegant-variant="ivory"] .luxe-curtain-panel::after {
        content: "";
        position: absolute;
        inset: 1.1rem;
        border: 1px solid rgba(167,123,50,.16);
        pointer-events: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .momena-luxe *,
        .momena-luxe *::before,
        .momena-luxe *::after {
          scroll-behavior: auto !important;
          animation-duration: .001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .001ms !important;
        }
      }

      @media (prefers-reduced-motion: no-preference) {
        .momena-luxe .luxe-float-a { animation: luxeFloat 10s ease-in-out infinite; }
        .momena-luxe .luxe-float-b { animation: luxeFloat 13s ease-in-out infinite reverse; }
        .momena-luxe .luxe-glow { animation: luxeGlow 5.5s ease-in-out infinite; }
        .momena-luxe .luxe-sweep::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(100deg, transparent 0%, rgba(240,216,148,.13) 46%, transparent 62%);
          transform: translateX(-110%);
          animation: luxeSweep 7s ease-in-out infinite;
          pointer-events: none;
        }
      }
    `}</style>
  );
}

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
      className={`luxe-sweep luxe-card-fill luxe-variant-ornament relative overflow-hidden border border-[var(--color-accent)]/22 px-5 py-9 backdrop-blur-sm sm:px-12 sm:py-14 ${className}`}
    >
      <CornerMark className="absolute -top-px -left-px" />
      <CornerMark className="absolute -top-px -right-px rotate-90" />
      <CornerMark className="absolute -bottom-px -left-px -rotate-90" />
      <CornerMark className="absolute -right-px -bottom-px rotate-180" />
      {children}
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
        className="pointer-events-none fixed inset-0 -z-30 bg-[var(--luxe-base)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 38% at 50% 0%, rgba(201,162,92,.16), transparent 65%), radial-gradient(ellipse 55% 30% at 50% 100%, rgba(201,162,92,.08), transparent 68%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,162,92,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,92,.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 50% 20%, black, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="luxe-float-a pointer-events-none fixed -left-24 top-32 -z-10 size-56 rounded-full border border-[var(--color-accent)]/10 bg-[radial-gradient(circle,rgba(201,162,92,.10),transparent_62%)]"
      />
      <div
        aria-hidden
        className="luxe-float-b pointer-events-none fixed -right-20 bottom-40 -z-10 size-64 rounded-full border border-[var(--color-accent)]/10 bg-[radial-gradient(circle,rgba(240,216,148,.08),transparent_64%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/45 to-transparent"
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
    <div className="mx-auto max-w-lg px-6 text-center">
      <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
        Invitation
      </p>
      <div className="mt-5 border-y border-[var(--color-accent)]/16 py-7">
        <p className="first-letter:font-display text-sm leading-8 text-[var(--color-ink-soft)] first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:leading-[0.82] first-letter:text-[var(--color-accent-ink)] first-letter:italic sm:text-[15px]">
          {invitation.description}
        </p>
      </div>
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
  "flex h-11 items-center gap-2 border border-[var(--color-accent)]/45 bg-[var(--color-surface)]/55 px-5 text-[10px] tracking-[0.2em] text-[var(--color-accent-ink)] uppercase shadow-[0_12px_32px_rgba(0,0,0,.12)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--luxe-button-ink)]";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = invitation.gallery;

  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? null : (current + 1) % photos.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? null : (current - 1 + photos.length) % photos.length,
        );
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, photos.length]);

  if (photos.length === 0) return null;

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const figure = target.closest("[data-gallery-index]") as HTMLElement | null;
    if (!figure) return;

    const index = Number(figure.dataset.galleryIndex);
    if (Number.isFinite(index)) setLightboxIndex(index);
  }

  function showPrevious() {
    setLightboxIndex((current) =>
      current === null ? null : (current - 1 + photos.length) % photos.length,
    );
  }

  function showNext() {
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % photos.length,
    );
  }

  const activePhoto = lightboxIndex === null ? null : photos[lightboxIndex];

  return (
    <>
      <div
        onClick={handleClick}
        className="luxe-sweep luxe-mobile-edge luxe-paper relative cursor-zoom-in overflow-hidden border border-[var(--color-accent)]/18 bg-[var(--color-surface)]/58 p-1.5 sm:p-4"
        style={{ boxShadow: "var(--luxe-gallery-shadow)" }}
      >
        <Gallery invitation={invitation} />
      </div>

      <AnimatePresence>
        {activePhoto && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Galeri foto"
            className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-16 backdrop-blur-sm sm:p-10"
            style={{ background: "var(--luxe-lightbox)" }}
          >
            <button
              type="button"
              aria-label="Tutup galeri"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center border border-[var(--color-accent)]/35 text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent)] hover:text-black sm:right-7 sm:top-7"
            >
              <X className="size-5" />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Foto sebelumnya"
                  onClick={showPrevious}
                  className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-[var(--color-accent)]/28 bg-black/45 text-[var(--color-accent-ink)] transition hover:border-[var(--color-accent)]/60 sm:left-7"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Foto berikutnya"
                  onClick={showNext}
                  className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center border border-[var(--color-accent)]/28 bg-black/45 text-[var(--color-accent-ink)] transition hover:border-[var(--color-accent)]/60 sm:right-7"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            <motion.div
              key={activePhoto.id}
              initial={{ opacity: 0, scale: 0.985, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="relative flex max-h-full w-full max-w-5xl flex-col items-center"
            >
              <div className="relative flex max-h-[72vh] w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- lightbox membutuhkan ukuran intrinsik sumber yang dipilih */}
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.caption ?? invitation.title}
                  className="max-h-[72vh] max-w-full border border-[var(--color-accent)]/18 object-contain shadow-[0_30px_120px_rgba(0,0,0,.6)]"
                />
              </div>

              <div className="mt-5 max-w-2xl text-center">
                <p className="text-[9px] tracking-[0.42em] text-[var(--color-accent)]/75 uppercase">
                  {String(lightboxIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </p>
                {activePhoto.caption && (
                  <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)] sm:text-[15px]">
                    {activePhoto.caption}
                  </p>
                )}
                <p className="mt-3 hidden text-[10px] tracking-[0.18em] text-[var(--color-ink-soft)]/45 uppercase sm:block">
                  Gunakan ← → untuk berpindah · Esc untuk menutup
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FlowMarker({ label }: { label: string }) {
  return (
    <div aria-hidden className="my-10 flex items-center gap-4 px-5 sm:my-14">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-accent)]/16" />
      <span className="text-[8px] tracking-[0.46em] text-[var(--color-accent)]/45 uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-accent)]/16" />
    </div>
  );
}

function ChapterNav({ invitation }: SectionProps) {
  const items = [
    { href: "#couple", label: "Couple", show: Boolean(invitation.couple) },
    { href: "#details", label: "Details", show: invitation.events.length > 0 || Boolean(invitation.eventDate) },
    { href: "#gallery", label: "Gallery", show: invitation.settings.showGallery && invitation.gallery.length > 0 },
    { href: "#story", label: "Story", show: invitation.settings.showStory && invitation.story.length > 0 },
    { href: "#rsvp", label: "RSVP", show: invitation.settings.showRsvp },
  ].filter((item) => item.show);

  return (
    <nav
      aria-label="Navigasi undangan"
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
    >
      {items.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          className="group flex items-center gap-2 text-[8px] tracking-[0.28em] text-[var(--color-ink-soft)]/45 uppercase transition hover:text-[var(--color-accent-ink)]"
        >
          <span className="opacity-0 transition group-hover:opacity-100">{item.label}</span>
          <span className="flex size-6 items-center justify-center rounded-full border border-[var(--color-accent)]/18 bg-[var(--color-surface)]/55 backdrop-blur-sm transition group-hover:border-[var(--color-accent)]/45">
            <span className="text-[7px] text-[var(--color-accent)]/65">{String(index + 1).padStart(2, "0")}</span>
          </span>
        </a>
      ))}
    </nav>
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
  const initials = invitation.couple
    ? `${invitation.couple.first.charAt(0)}${invitation.couple.second.charAt(0)}`.toUpperCase()
    : invitation.title.charAt(0).toUpperCase();

  return (
    <motion.div
      variants={gatePanelVariants}
      initial="visible"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[var(--luxe-gate)] px-6 text-center"
    >
      {invitation.coverImageUrl && (
        <div
          aria-hidden
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-[0.14] blur-[1px]"
          style={{
            backgroundImage: `url(${invitation.coverImageUrl})`,
            backgroundPosition: `${invitation.coverImagePositionX}% ${invitation.coverImagePositionY}%`,
          }}
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,92,.15),_transparent_58%)]" />
      <div aria-hidden className="luxe-glow absolute left-1/2 top-1/2 aspect-square w-[min(86vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-accent)]/12" />
      <div aria-hidden className="luxe-glow absolute left-1/2 top-1/2 aspect-square w-[min(62vw,300px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--color-accent)]/10" />
      <motion.div
        aria-hidden
        exit={{ x: "-101%" }}
        transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1], delay: 0.18 }}
        className="luxe-curtain-panel absolute inset-y-0 left-0 w-1/2 border-r border-[var(--color-accent)]/20 bg-[linear-gradient(90deg,var(--luxe-curtain-a),var(--luxe-curtain-b),var(--luxe-curtain-a))] shadow-[20px_0_80px_rgba(0,0,0,.5)]"
      />
      <motion.div
        aria-hidden
        exit={{ x: "101%" }}
        transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1], delay: 0.18 }}
        className="luxe-curtain-panel absolute inset-y-0 right-0 w-1/2 border-l border-[var(--color-accent)]/20 bg-[linear-gradient(270deg,var(--luxe-curtain-a),var(--luxe-curtain-b),var(--luxe-curtain-a))] shadow-[-20px_0_80px_rgba(0,0,0,.5)]"
      />

      <motion.div variants={gateContentVariants} className="relative z-10 flex max-w-sm flex-col items-center">
        <p className="font-serif text-sm italic text-[var(--color-ink-soft)]">Bismillahirrahmanirrahim</p>
        <div className="relative my-5 flex size-16 items-center justify-center rounded-full border border-[var(--color-accent)]/45 shadow-[0_0_36px_rgba(201,162,92,.08)]">
          <span className="absolute inset-1.5 rounded-full border border-[var(--color-accent)]/18" />
          <span className="font-display text-xl tracking-[0.08em] text-[var(--color-gold-light)] italic">{initials}</span>
        </div>
        <p className="text-[9px] tracking-[0.6em] text-[var(--color-accent)]/75 uppercase">The Wedding Of</p>
        <h1 className="font-display mt-4 text-[clamp(3.1rem,13vw,4.8rem)] leading-[0.95] text-[var(--color-gold-light)] italic drop-shadow-[0_4px_15px_rgba(201,162,92,.18)]">
          {coupleName}
        </h1>

        <div className="my-7 h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-accent)]/60 to-transparent" />

        <div className="min-h-14">
          <p className="text-[10px] tracking-[0.25em] text-[var(--color-ink-soft)] uppercase">Kepada Yth.</p>
          <p className="font-display mt-2 text-2xl text-[var(--color-accent-ink)] italic">
            {guestName || "Tamu Undangan"}
          </p>
        </div>

        <button
          onClick={onOpen}
          className="group mt-8 flex h-12 items-center justify-center border border-[var(--color-accent)]/70 px-9 text-[10px] tracking-[0.34em] text-[var(--color-accent-ink)] uppercase shadow-[0_0_24px_rgba(201,162,92,.08)] transition-all hover:bg-[var(--color-accent)] hover:text-[var(--luxe-button-ink)] hover:shadow-[0_0_34px_rgba(201,162,92,.24)]"
        >
          Buka Undangan <span className="ml-3 transition-transform group-hover:translate-x-1">✦</span>
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
 * Gaya dark ceremonial luxury: charcoal/black/gold, whitespace lega, kartu berbingkai
 * untuk section informasi resmi, ornamen bervariasi (bukan 1 motif
 * diulang), transisi fade+slide yang lambat & lembut (0.8–1s). Section
 * yang tidak punya data (mis. belum ada Quote/Video/Story) otomatis
 * menyembunyikan diri sendiri seperti biasa — bingkai di sekitarnya juga
 * ikut tidak render karena kontennya kosong.
 */
export function ElegantTemplate({ invitation, guestName }: SectionProps) {
  const { isOpen, open } = useInvitationGate();
  const music = useMusicToggle();
  const savedVariant: ElegantVariant = invitation.settings.templateVariant === "ivory" ? "ivory" : "noir";
  const [variant, setVariant] = useState<ElegantVariant>(savedVariant);

  useEffect(() => {
    if (!invitation.isPreview) return;
    const requested = new URLSearchParams(window.location.search).get("variant");
    if (requested === "ivory" || requested === "noir") setVariant(requested);
  }, [invitation.isPreview]);

  function switchVariant(next: ElegantVariant) {
    setVariant(next);
    const url = new URL(window.location.href);
    if (next === "noir") url.searchParams.delete("variant");
    else url.searchParams.set("variant", next);
    window.history.replaceState({}, "", url);
  }

  function handleOpen() {
    open();
    // Klik "Buka Undangan" adalah user-gesture — momen yang tepat (dan
    // satu-satunya yang diizinkan browser) untuk autoplay musik.
    if (invitation.musicUrl) music.play();
  }

  return (
    <div
      style={{
        ...elegantThemes[variant],
        ...(invitation.settings.accentColor
          ? ({ "--color-accent": invitation.settings.accentColor, "--color-gold-light": invitation.settings.accentColor } as React.CSSProperties)
          : {}),
      }}
      data-elegant-variant={variant}
      className="momena-luxe luxe-paper min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] selection:bg-[var(--color-accent)]/25 [&_h1]:tracking-wide [&_h2]:font-medium [&_h2]:tracking-wide"
    >
      <LuxuryRuntimeStyles />
      <AtmosphereBackground />
      <ScrollProgressBar />
      {isOpen && <ChapterNav invitation={invitation} />}

      {invitation.isPreview && (
        <div className="fixed top-[4.75rem] right-3 z-[65] flex overflow-hidden border border-[var(--color-accent)]/30 bg-[var(--color-surface)]/92 p-1 shadow-[0_12px_40px_rgba(0,0,0,.18)] backdrop-blur-md sm:top-20 sm:right-5">
          {(["noir", "ivory"] as ElegantVariant[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => switchVariant(item)}
              className={`h-9 px-4 text-[9px] tracking-[0.25em] uppercase transition ${
                variant === item
                  ? "bg-[var(--color-accent)] text-[var(--luxe-button-ink)]"
                  : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {!isOpen && (
          <CoverGate invitation={invitation} guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-[720px] overflow-hidden px-3 pb-28 sm:px-6">
        <Hero invitation={invitation} />

        <Ornament variant="laurel" />

        <div id="couple">
          <Reveal duration={0.9} distance={24} className="luxe-section">
          <FramedCard>
            <BrideGroom invitation={invitation} />
            <Ornament variant="line" />
            <Location invitation={invitation} />
          </FramedCard>
        </Reveal>
        </div>

        <FlowMarker label="Invitation" />

        <Reveal duration={0.9} distance={24} className="luxe-section my-12 sm:my-16">
          <WelcomeNote invitation={invitation} />
        </Reveal>

        <UtilityActions invitation={invitation} />

        <div id="details">
          <Reveal duration={0.9} distance={24} className="luxe-section my-12 sm:my-16">
          <FramedCard>
            <Countdown invitation={invitation} />
          </FramedCard>
        </Reveal>
        </div>

        {(invitation.settings.showGallery || invitation.settings.showStory) && <FlowMarker label="Memories" />}

        {invitation.settings.showGallery && (
          <div id="gallery">
            <Reveal duration={0.9} distance={24} className="luxe-section my-12 sm:my-16">
              <FramedGallery invitation={invitation} />
            </Reveal>
          </div>
        )}

        {invitation.settings.showStory && (
          <div id="story">
            <Reveal duration={0.9} distance={24} className="luxe-section my-12 sm:my-16">
              <LoveStory invitation={invitation} />
            </Reveal>
          </div>
        )}

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

        {invitation.settings.showVideo && (
          <Reveal duration={0.9} distance={24} className="luxe-section my-12 sm:my-16">
            <Video invitation={invitation} />
          </Reveal>
        )}

        {(invitation.settings.showGift || invitation.settings.showRsvp) && <FlowMarker label="Blessing" />}

        <Ornament variant="laurel" />

        {invitation.settings.showGift && (
          <Reveal duration={0.9} distance={24} className="luxe-section">
            <FramedCard>
              <Gift invitation={invitation} />
            </FramedCard>
          </Reveal>
        )}

        {invitation.settings.showRsvp && (
          <Reveal duration={0.9} distance={24} className="luxe-section my-12 sm:my-16">
            <FramedCard>
              <Rsvp invitation={invitation} guestName={guestName} />
            </FramedCard>
          </Reveal>
        )}

        <Ornament variant="diamond" />

        <Footer invitation={invitation} />
      </div>

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
