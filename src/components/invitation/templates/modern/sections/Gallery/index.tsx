import Image from "next/image";

import type { SectionProps } from "../../../../types";

export function Gallery({ invitation }: SectionProps) {
  if (!invitation.gallery.length) return null;

  return (
    <section className="overflow-hidden bg-[#0b0d13] py-18 text-white sm:py-24">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 border-b border-white/10 pb-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] tracking-[.35em] text-[#ff5f9f] uppercase">Visual diary</p>
            <h2 className="mt-3 text-[clamp(3.6rem,9vw,7rem)] font-black leading-[.82] tracking-[-.065em] uppercase">
              Scroll through<br />the moments.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-7 text-white/42">
            Swipe horizontally. A collection of frames, details, and fragments from our story.
          </p>
        </div>
      </div>

      <div className="modern-gallery-scroll mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(3rem,calc((100vw-1500px)/2+3rem))]">
        {invitation.gallery.map((photo, index) => {
          const portrait = index % 3 !== 1;
          return (
            <figure
              key={photo.id}
              className={`${portrait ? "w-[72vw] sm:w-[430px]" : "w-[86vw] sm:w-[620px]"} group relative aspect-[4/5] shrink-0 snap-center overflow-hidden bg-white/5 sm:aspect-[5/6]`}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption ?? invitation.title}
                fill
                sizes="(min-width:640px) 620px, 86vw"
                className="object-cover transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 text-[9px] tracking-[.3em] text-white/62 uppercase">
                {String(index + 1).padStart(2, "0")}
              </span>
              {photo.caption && (
                <figcaption className="absolute bottom-4 left-4 right-4 max-w-sm text-xs leading-5 text-white/72 sm:text-sm sm:leading-6">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
      <style>{`.modern-gallery-scroll{scrollbar-width:none}.modern-gallery-scroll::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
}
