"use client";

import { useEffect, useState } from "react";

import type { SectionProps } from "../../../../types";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

export function Countdown({ invitation }: SectionProps) {
  const eventDate = invitation.eventDate;
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    if (!eventDate) return;
    setTimeLeft(getTimeLeft(eventDate));
    const id = setInterval(() => setTimeLeft(getTimeLeft(eventDate)), 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  if (!eventDate) return null;

  return (
    <section className="overflow-hidden bg-[#d8ff58] px-5 py-14 text-[#0b0d12] sm:px-8 sm:py-18 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex items-center justify-between border-b border-black/20 pb-4 text-[9px] font-bold tracking-[.3em] uppercase">
          <span>Countdown</span><span>Save the date</span>
        </div>
        {timeLeft ? (
          <div className="mt-6 overflow-hidden whitespace-nowrap text-[clamp(3.1rem,12vw,10rem)] font-black leading-none tracking-[-.075em] tabular-nums">
            {String(timeLeft.days).padStart(2, "0")}
            <span className="mx-[.05em] text-black/25">:</span>
            {String(timeLeft.hours).padStart(2, "0")}
            <span className="mx-[.05em] text-black/25">:</span>
            {String(timeLeft.minutes).padStart(2, "0")}
            <span className="mx-[.05em] text-black/25">:</span>
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
        ) : (
          <p className="mt-6 text-[clamp(3rem,10vw,8rem)] font-black leading-[.8] tracking-[-.06em] uppercase">The day is here.</p>
        )}
        <div className="mt-5 grid grid-cols-4 gap-3 border-t border-black/20 pt-4 text-[9px] font-bold tracking-[.22em] uppercase text-black/48">
          <span>Days</span><span>Hours</span><span>Minutes</span><span>Seconds</span>
        </div>
      </div>
    </section>
  );
}
