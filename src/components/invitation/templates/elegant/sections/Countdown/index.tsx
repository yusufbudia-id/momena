"use client";

import { useEffect, useState } from "react";

import type { SectionProps } from "../../../../types";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Countdown lokal Elegant — angka besar serif italic dipisah garis tipis
 * (bukan kotak rounded standar), karena section ini sudah dibungkus
 * `FramedCard` di template (jadi tidak perlu bingkai/background sendiri).
 */
export function Countdown({ invitation }: SectionProps) {
  const eventDate = invitation.eventDate;
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    if (!eventDate) return;

    setTimeLeft(getTimeLeft(eventDate));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(eventDate)), 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  if (!eventDate) return null;

  return (
    <section className="text-center">
      <p className="text-xs tracking-[0.4em] text-[var(--color-ink-soft)] uppercase">
        Menghitung Hari
      </p>
      <h3 className="font-display mt-2 text-2xl text-[var(--color-ink)] italic">
        Menuju Hari Bahagia
      </h3>

      {timeLeft ? (
        <div className="mx-auto mt-8 flex max-w-sm items-stretch justify-center divide-x divide-[var(--color-accent)]/30">
          <TimeBlock label="Hari" value={timeLeft.days} />
          <TimeBlock label="Jam" value={timeLeft.hours} />
          <TimeBlock label="Menit" value={timeLeft.minutes} />
          <TimeBlock label="Detik" value={timeLeft.seconds} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
          Acara sudah berlangsung.
        </p>
      )}
    </section>
  );
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5 px-3 sm:px-6">
      <span className="font-display text-4xl text-[var(--color-accent-ink)] italic tabular-nums sm:text-5xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] tracking-[0.25em] text-[var(--color-ink-soft)] uppercase">
        {label}
      </span>
    </div>
  );
}
