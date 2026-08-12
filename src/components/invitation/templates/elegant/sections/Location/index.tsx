import { MapPin } from "lucide-react";

import type { SectionProps } from "../../../../types";

/**
 * Location lokal Elegant — tanpa kotak sendiri (section ini dibungkus
 * `FramedCard` bareng BrideGroom di template), tombol pill outline
 * konsisten dengan gaya tombol lain di Elegant (CoverGate, UtilityActions).
 */
export function Location({ invitation }: SectionProps) {
  const { eventLocation, eventAddress, eventMapsUrl } = invitation;

  if (!eventLocation && !eventAddress && !eventMapsUrl) return null;

  return (
    <section className="text-center">
      <p className="text-xs tracking-[0.4em] text-[var(--color-ink-soft)] uppercase">
        Lokasi Acara
      </p>
      <div className="mx-auto mt-4 flex max-w-xs flex-col items-center gap-2">
        <MapPin className="size-5 text-[var(--color-accent)]" strokeWidth={1.5} />
        {eventLocation && (
          <p className="font-display text-xl text-[var(--color-ink)] italic">
            {eventLocation}
          </p>
        )}
        {eventAddress && (
          <p className="text-sm text-[var(--color-ink-soft)]">{eventAddress}</p>
        )}
        {eventMapsUrl && (
          <a
            href={eventMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex h-11 items-center rounded-full border border-[var(--color-accent)] px-6 text-xs tracking-[0.2em] text-[var(--color-accent-ink)] uppercase transition-colors hover:bg-[var(--color-accent-soft)]"
          >
            Buka di Google Maps
          </a>
        )}
      </div>
    </section>
  );
}
