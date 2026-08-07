"use client";

import { Pause, Play } from "lucide-react";
import type { RefObject } from "react";

interface MusicToggleProps {
  musicUrl: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  playing: boolean;
  onToggle: () => void;
  /** Override posisi/style — default sudah pas untuk kebanyakan template. */
  className?: string;
}

const defaultClassName =
  "border-accent bg-surface text-accent-ink fixed right-4 bottom-24 z-40 flex size-11 items-center justify-center rounded-full border shadow-md";

/**
 * Tombol musik latar + elemen `<audio>`-nya. Presentational murni — state
 * play/pause datang dari `useMusicToggle()` (dipanggil di level template,
 * supaya cover gate template bisa memicu autoplay lewat instance yang
 * sama). Style default pakai token warna global (`bg-surface`, dst), jadi
 * otomatis ikut palet tiap template lewat CSS variable cascade tanpa perlu
 * di-override manual.
 */
export function MusicToggle({
  musicUrl,
  audioRef,
  playing,
  onToggle,
  className,
}: MusicToggleProps) {
  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />
      <button
        onClick={onToggle}
        aria-label={playing ? "Matikan musik" : "Putar musik"}
        className={className ?? defaultClassName}
      >
        {playing ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
      </button>
    </>
  );
}
