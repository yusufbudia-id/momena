import { ArrowUpRight, MapPin } from "lucide-react";
import type { SectionProps } from "../../../../types";

export function Location({ invitation }: SectionProps) {
  if (!invitation.eventLocation && !invitation.eventAddress && !invitation.eventMapsUrl) return null;

  const date = invitation.eventDate;
  const day = date ? new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(date) : null;
  const month = date ? new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date).replace(".", "") : null;
  const time = date ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(date) : null;

  return (
    <section id="details" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[720px]">
        <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">03 · Details</p>
        <div className="mt-4 grid border-t border-[var(--minimal-line)] sm:grid-cols-[150px_1fr]">
          <div className="border-b border-[var(--minimal-line)] py-7 sm:border-r sm:border-b-0 sm:pr-7">
            {day && <p className="font-display text-6xl leading-none tracking-[-0.06em] text-[var(--minimal-ink)]">{day}</p>}
            {month && <p className="mt-2 text-[10px] tracking-[0.3em] text-[var(--minimal-muted)] uppercase">{month}</p>}
            {time && <p className="mt-4 text-sm text-[var(--minimal-ink)]">{time} WIB</p>}
          </div>
          <div className="py-7 sm:pl-8">
            <MapPin className="size-4 text-[var(--minimal-accent)]" strokeWidth={1.5} />
            {invitation.eventLocation && (
              <h2 className="font-display mt-4 text-3xl tracking-[-0.03em] text-[var(--minimal-ink)] italic sm:text-4xl">
                {invitation.eventLocation}
              </h2>
            )}
            {invitation.eventAddress && (
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--minimal-muted)]">{invitation.eventAddress}</p>
            )}
            {invitation.eventMapsUrl && (
              <a
                href={invitation.eventMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 border-b border-[var(--minimal-ink)] pb-1 text-[10px] tracking-[0.22em] text-[var(--minimal-ink)] uppercase transition-opacity hover:opacity-55"
              >
                Buka Google Maps <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
