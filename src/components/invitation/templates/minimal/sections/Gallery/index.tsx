import Image from "next/image";
import type { SectionProps } from "../../../../types";

export function Gallery({ invitation }: SectionProps) {
  if (invitation.gallery.length === 0) return null;

  return (
    <section id="gallery" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[820px]">
        <div className="flex items-end justify-between gap-6 border-b border-[var(--minimal-line)] pb-6">
          <div>
            <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">04 · Journal</p>
            <h2 className="font-display mt-3 text-4xl tracking-[-0.04em] text-[var(--minimal-ink)] italic sm:text-5xl">Fragments of us.</h2>
          </div>
          <p className="hidden max-w-[220px] text-right text-xs leading-6 text-[var(--minimal-muted)] sm:block">
            Beberapa potongan momen yang ingin kami simpan dan bagikan.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-12 sm:gap-3">
          {invitation.gallery.map((photo, index) => {
            const layout = [
              "col-span-2 aspect-[4/3] sm:col-span-8 sm:row-span-2",
              "aspect-[4/5] sm:col-span-4",
              "aspect-square sm:col-span-4",
              "aspect-[4/5] sm:col-span-5",
              "aspect-[4/5] sm:col-span-7",
              "col-span-2 aspect-[16/9] sm:col-span-12",
            ][index % 6];
            return (
              <figure key={photo.id} className={`group relative overflow-hidden bg-[var(--minimal-soft)] ${layout}`}>
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption ?? invitation.title}
                  fill
                  sizes="(min-width: 640px) 60vw, 100vw"
                  className="object-cover grayscale-[8%] saturate-[.82] transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[.04]" />
                {photo.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pt-10 pb-4 text-xs leading-5 text-white opacity-0 transition group-hover:opacity-100">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
