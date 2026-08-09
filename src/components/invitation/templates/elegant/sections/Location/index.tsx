import type { SectionProps } from "../../../../types";

export function Location({ invitation }: SectionProps) {
  const { eventLocation, eventAddress, eventMapsUrl } = invitation;

  if (!eventLocation && !eventAddress && !eventMapsUrl) return null;

  return (
    <section className="px-6 py-16 text-center">
      <h2 className="font-display text-ink text-2xl italic">Lokasi Acara</h2>
      <div className="border-line bg-surface mx-auto mt-6 max-w-md rounded-xl border p-6">
        {eventLocation && <p className="text-ink font-medium">{eventLocation}</p>}
        {eventAddress && <p className="text-ink-soft mt-1 text-sm">{eventAddress}</p>}
        {eventMapsUrl && (
          <a
            href={eventMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent hover:bg-accent-ink mt-4 inline-flex h-11 min-w-11 items-center justify-center rounded-md px-4 text-sm font-medium text-white"
          >
            Buka di Google Maps
          </a>
        )}
      </div>
    </section>
  );
}
