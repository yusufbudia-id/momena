"use client";

import { useRef, useState } from "react";

/**
 * State musik latar — dipakai semua template yang punya toggle musik.
 * `play()` diekspos terpisah dari `toggle()` supaya cover gate bisa
 * memicu autoplay tepat saat tombol "Buka Undangan" diklik (itu momen
 * user-gesture yang dibutuhkan browser sebelum audio boleh diputar
 * otomatis) tanpa gate perlu tahu detail elemen `<audio>`-nya.
 */
export function useMusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    audioRef.current?.play().catch(() => {
      // Browser bisa saja tetap menolak play() di luar user gesture —
      // diamkan saja, tombol toggle tetap bisa dicoba manual.
    });
    setPlaying(true);
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      play();
    }
  }

  return { audioRef, playing, play, toggle };
}
