"use client";

import { useEffect, useState } from "react";

import type { SectionProps } from "../../types";

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
    <section className="px-6 py-16 text-center">
      <h2 className="font-display text-ink text-2xl italic">Menuju Hari Bahagia</h2>
      {timeLeft ? (
        <div className="mx-auto mt-6 flex max-w-md justify-center gap-3 sm:gap-6">
          <TimeBlock label="Hari" value={timeLeft.days} />
          <TimeBlock label="Jam" value={timeLeft.hours} />
          <TimeBlock label="Menit" value={timeLeft.minutes} />
          <TimeBlock label="Detik" value={timeLeft.seconds} />
        </div>
      ) : (
        <p className="text-ink-soft mt-4 text-sm">Acara sudah berlangsung.</p>
      )}
    </section>
  );
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-line bg-surface flex flex-col items-center rounded-lg border px-3 py-2 sm:px-5 sm:py-3">
      <span className="font-display text-ink text-2xl italic tabular-nums sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-ink-soft text-[10px] tracking-wide uppercase">{label}</span>
    </div>
  );
}
