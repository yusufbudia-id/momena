import { MapPin } from "lucide-react";

import type { SectionProps } from "../../../../types";

export function Location({ invitation }: SectionProps) {
  const { eventLocation, eventAddress, eventMapsUrl } = invitation;

  if (!eventLocation && !eventAddress && !eventMapsUrl) return null;

  return (
    <section className="text-center">
      <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
        Venue
      </p>
      <h2 className="font-display mt-3 text-3xl italic text-[var(--color-ink)] sm:text-4xl">
        Lokasi Acara
      </h2>

      <div className="mx-auto mt-6 max-w-xl border border-[var(--color-accent)]/16 bg-[linear-gradient(180deg,rgba(201,162,92,.05),rgba(0,0,0,0))] px-6 py-8 shadow-[inset_0_0_40px_rgba(201,162,92,.02)] sm:px-8">
        <MapPin className="mx-auto size-5 text-[var(--color-accent)]" strokeWidth={1.5} />
        {eventLocation && (
          <p className="font-display mt-3 text-2xl italic text-[var(--color-gold-light)] sm:text-3xl">
            {eventLocation}
          </p>
        )}
        {eventAddress && (
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
            {eventAddress}
          </p>
        )}
        {eventMapsUrl && (
          <a
            href={eventMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center border border-[var(--color-accent)]/55 px-6 text-[10px] tracking-[0.28em] text-[var(--color-accent-ink)] uppercase transition-all hover:bg-[var(--color-accent)] hover:text-[var(--luxe-button-ink)]"
          >
            Buka Google Maps
          </a>
        )}
      </div>
    </section>
  );
}
