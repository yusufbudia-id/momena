import { PlayCircle } from "lucide-react";

import type { SectionProps } from "../../../../types";

function getEmbedUrl(url: string): string | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

export function Video({ invitation }: SectionProps) {
  if (!invitation.videoUrl) return null;

  const embedUrl = getEmbedUrl(invitation.videoUrl);

  return (
    <section className="px-6 py-12 text-center sm:py-16">
      <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
        Video
      </p>
      <h2 className="font-display mt-3 text-3xl italic text-[var(--color-ink)] sm:text-4xl">
        Simpan Kisah Ini
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
        Sebuah cuplikan singkat untuk mengenang perjalanan menuju hari yang penuh makna.
      </p>

      <div className="mx-auto mt-8 max-w-3xl border border-[var(--color-accent)]/18 bg-[var(--color-surface)]/65 p-3 shadow-[0_18px_56px_rgba(0,0,0,.22)] sm:p-4">
        <div className="overflow-hidden border border-[var(--color-accent)]/12 bg-black/40">
          {embedUrl ? (
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title="Video undangan"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={invitation.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-52 flex-col items-center justify-center gap-3 p-8 text-[var(--color-accent-ink)] transition hover:bg-[var(--color-accent)]/6"
            >
              <PlayCircle className="size-10" strokeWidth={1.5} />
              <span className="text-xs tracking-[0.28em] uppercase">Tonton video</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
