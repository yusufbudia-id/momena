import { ArrowUpRight } from "lucide-react";

import type { SectionProps } from "../../../../types";

export function Location({ invitation }: SectionProps) {
  const { eventLocation, eventAddress, eventMapsUrl, eventDate } = invitation;
  if (!eventLocation && !eventAddress && !eventMapsUrl) return null;

  const day = eventDate ? new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(eventDate) : "--";
  const month = eventDate ? new Intl.DateTimeFormat("id-ID", { month: "short" }).format(eventDate) : "---";
  const year = eventDate ? new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(eventDate) : "----";
  const time = eventDate ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(eventDate) : null;

  return (
    <section className="bg-[#f0efeb] px-5 py-18 text-[#0c0e14] sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-[.35em] text-[#765cff] uppercase">Event pass</p>
            <h2 className="mt-3 text-[clamp(3.8rem,10vw,8rem)] font-black leading-[.78] tracking-[-.07em] uppercase">Be there.</h2>
          </div>
          <span className="hidden text-[10px] font-bold tracking-[.3em] text-black/30 uppercase sm:block">Admit one / wedding day</span>
        </div>

        <div className="grid border border-black/18 bg-white/35 lg:grid-cols-[.72fr_1.28fr]">
          <div className="border-b border-black/18 p-6 lg:border-r lg:border-b-0 lg:p-8">
            <p className="text-[9px] font-bold tracking-[.28em] text-black/40 uppercase">Date / time</p>
            <div className="mt-6 flex items-end gap-4">
              <span className="text-[clamp(5rem,11vw,9rem)] font-black leading-[.7] tracking-[-.08em] text-[#ff5f9f]">{day}</span>
              <div className="pb-1">
                <p className="text-lg font-black uppercase">{month}</p>
                <p className="text-sm font-semibold text-black/48">{year}</p>
                {time && <p className="mt-2 text-[10px] font-bold tracking-[.2em] text-[#765cff] uppercase">{time} WIB</p>}
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <p className="text-[9px] font-bold tracking-[.28em] text-black/40 uppercase">Venue / coordinates</p>
            {eventLocation && <h3 className="mt-5 max-w-3xl text-3xl font-black leading-[.95] tracking-[-.04em] uppercase sm:text-5xl">{eventLocation}</h3>}
            {eventAddress && <p className="mt-4 max-w-2xl text-sm leading-7 text-black/52 sm:text-base">{eventAddress}</p>}
            {eventMapsUrl && (
              <a href={eventMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-12 items-center gap-3 bg-[#0c0e14] px-5 text-[10px] font-black tracking-[.24em] text-white uppercase transition hover:bg-[#765cff]">
                Open maps <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
