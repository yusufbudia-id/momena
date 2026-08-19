"use client";

import { CalendarDays, Clock3, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

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

  const fullDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(eventDate);

  const timeLabel = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(eventDate);

  return (
    <section className="text-center">
      <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
        Countdown
      </p>
      <h2 className="font-display mt-3 text-3xl italic text-[var(--color-ink)] sm:text-4xl">
        Menuju Hari Bahagia
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
        Setiap detik membawa kami semakin dekat pada awal perjalanan baru yang akan
        kami jalani bersama.
      </p>

      <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
        <InfoPill icon={<CalendarDays className="size-4" />} label={fullDate} />
        <InfoPill icon={<Clock3 className="size-4" />} label={timeLabel} />
      </div>

      {timeLeft ? (
        <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <TimeBlock label="Hari" value={timeLeft.days} />
          <TimeBlock label="Jam" value={timeLeft.hours} />
          <TimeBlock label="Menit" value={timeLeft.minutes} />
          <TimeBlock label="Detik" value={timeLeft.seconds} />
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]/75 px-6 py-6 text-center shadow-[inset_0_0_40px_rgba(201,162,92,.02)]">
          <Sparkles className="mx-auto size-5 text-[var(--color-accent)]" strokeWidth={1.5} />
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
            Momen istimewa ini telah berlangsung. Terima kasih sudah menjadi bagian dari
            kebahagiaan kami.
          </p>
        </div>
      )}
    </section>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-h-12 items-center justify-center gap-2 border border-[var(--color-accent)]/18 bg-[var(--color-surface)]/55 px-4 py-3 text-sm text-[var(--color-ink-soft)] shadow-[inset_0_0_40px_rgba(201,162,92,.02)]">
      <span className="text-[var(--color-accent)]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="relative overflow-hidden border border-[var(--color-accent)]/18 bg-[linear-gradient(180deg,rgba(201,162,92,.07),rgba(0,0,0,0))] px-3 py-5 shadow-[inset_0_0_40px_rgba(201,162,92,.03),0_16px_40px_rgba(0,0,0,.14)]">
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent" />
      <span className="font-display block text-[clamp(2.3rem,8vw,3.6rem)] leading-none text-[var(--color-gold-light)] italic tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 block text-[10px] tracking-[0.32em] text-[var(--color-ink-soft)] uppercase">
        {label}
      </span>
    </div>
  );
}
