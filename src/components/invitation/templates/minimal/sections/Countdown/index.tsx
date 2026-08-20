"use client";

import { useEffect, useState } from "react";
import type { SectionProps } from "../../../../types";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ invitation }: SectionProps) {
  const date = invitation.eventDate;
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    if (!date) return;
    setTimeLeft(getTimeLeft(date));
    const id = setInterval(() => setTimeLeft(getTimeLeft(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  if (!date) return null;

  return (
    <section id="date" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[720px] border-y border-[var(--minimal-line)] py-9 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-[.8fr_1.2fr] sm:items-center">
          <div>
            <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">02 · Save The Date</p>
            <h2 className="font-display mt-3 text-4xl tracking-[-0.04em] text-[var(--minimal-ink)] italic">
              Menghitung hari.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--minimal-muted)]">
              Sampai kita bertemu pada hari bahagia kami.
            </p>
          </div>

          {timeLeft ? (
            <div className="grid grid-cols-4 divide-x divide-[var(--minimal-line)]">
              <Time value={timeLeft.days} label="Hari" />
              <Time value={timeLeft.hours} label="Jam" />
              <Time value={timeLeft.minutes} label="Menit" />
              <Time value={timeLeft.seconds} label="Detik" />
            </div>
          ) : (
            <p className="text-sm text-[var(--minimal-muted)]">Hari istimewa telah tiba.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Time({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-2 text-center sm:px-4">
      <span className="font-display block text-[clamp(2rem,7vw,3.5rem)] leading-none tracking-[-0.04em] text-[var(--minimal-ink)] tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 block text-[8px] tracking-[0.24em] text-[var(--minimal-muted)] uppercase">{label}</span>
    </div>
  );
}
