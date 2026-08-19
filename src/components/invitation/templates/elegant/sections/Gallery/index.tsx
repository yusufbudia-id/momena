import Image from "next/image";

import type { SectionProps } from "../../../../types";

export function Gallery({ invitation }: SectionProps) {
  if (invitation.gallery.length === 0) return null;

  return (
    <section className="px-3 py-8 sm:px-2 sm:py-10">
      <div className="px-3 text-center sm:px-6">
        <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
          Gallery
        </p>
        <h2 className="font-display mt-3 text-3xl italic text-[var(--color-ink)] sm:text-4xl">
          Momen yang Tersimpan
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
          Potongan kenangan sederhana yang mengantar kami menuju hari istimewa ini.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {invitation.gallery.map((photo, index) => {
          const featured = index === 0;
          const portrait = index % 3 === 1;

          return (
            <figure
              key={photo.id}
              className={[
                "group relative overflow-hidden border border-[var(--color-accent)]/15 bg-[var(--color-surface)]/60 shadow-[0_16px_40px_rgba(0,0,0,.18)]",
                featured ? "col-span-2 aspect-[16/10] md:col-span-2" : portrait ? "aspect-[4/5]" : "aspect-square",
              ].join(" ")}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption ?? invitation.title}
                fill
                sizes={featured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                className="object-cover transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-[6%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-70" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5">
                <span className="inline-flex items-center gap-2 text-[9px] tracking-[0.38em] text-[var(--color-gold-light)] uppercase">
                  <span className="size-1 rotate-45 bg-[var(--color-accent)]" />
                  Memory
                </span>
                {photo.caption && (
                  <figcaption className="mt-2 line-clamp-3 text-sm leading-6 text-white/90">
                    {photo.caption}
                  </figcaption>
                )}
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
