import Image from "next/image";

import type { SectionProps } from "../../../../types";

export function Gallery({ invitation }: SectionProps) {
  if (invitation.gallery.length === 0) return null;

  return (
    <section className="px-2 py-7 sm:px-2 sm:py-10">
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

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">
        {invitation.gallery.map((photo, index) => {
          const featured = index === 0;
          const portrait = index % 3 === 1;

          return (
            <figure
              key={photo.id}
              data-gallery-index={index}
              style={{ boxShadow: "var(--luxe-gallery-shadow)" }}
              className={[
                "group relative overflow-hidden border border-[var(--color-accent)]/15 bg-[var(--color-surface)]/60 ",
                featured
                  ? "col-span-2 aspect-[16/10] md:col-span-2"
                  : portrait
                    ? "aspect-[4/5]"
                    : "aspect-square",
              ].join(" ")}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption ?? invitation.title}
                fill
                sizes={
                  featured
                    ? "(min-width: 768px) 66vw, 100vw"
                    : "(min-width: 768px) 33vw, 50vw"
                }
                className="luxe-photo object-cover transition duration-700 group-hover:scale-[1.045] group-hover:contrast-[1.04]"
              />
              <div className="luxe-gallery-overlay absolute inset-0 opacity-75 transition-opacity group-hover:opacity-90" />
              <div className="pointer-events-none absolute inset-2.5 border border-[var(--color-accent)]/0 transition-colors duration-500 group-hover:border-[var(--color-accent)]/22 sm:inset-3" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-left sm:p-5">
                <span className="inline-flex items-center gap-2 text-[8px] tracking-[0.36em] text-[var(--color-gold-light)] uppercase sm:text-[9px]">
                  <span className="size-1 rotate-45 bg-[var(--color-accent)]" />
                  Memory {String(index + 1).padStart(2, "0")}
                </span>
                {photo.caption && (
                  <figcaption className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--luxe-caption)] sm:text-sm sm:leading-6">
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
