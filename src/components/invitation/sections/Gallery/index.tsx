import Image from "next/image";

import type { SectionProps } from "../../types";

export function Gallery({ invitation }: SectionProps) {
  if (invitation.gallery.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <h2 className="text-ink font-display text-center text-2xl italic">Galeri</h2>
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
        {invitation.gallery.map((photo) => (
          // next/image lazy-load default (bukan priority) — pas untuk
          // section yang biasanya di bawah lipatan layar pertama.
          <div
            key={photo.id}
            className="relative aspect-square w-full overflow-hidden rounded-lg"
          >
            <Image
              src={photo.imageUrl}
              alt={photo.caption ?? invitation.title}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
