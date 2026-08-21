import { ArrowUpRight } from "lucide-react";

import type { SectionProps } from "../../../../types";

function getEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  return vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : null;
}

export function Video({ invitation }: SectionProps) {
  if (!invitation.videoUrl) return null;
  const embedUrl = getEmbedUrl(invitation.videoUrl);

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[760px] border-y border-[var(--minimal-line)] py-8">
        <div className="mb-6 flex items-end justify-between gap-5">
          <div>
            <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">Moving memories</p>
            <h2 className="font-display mt-2 text-3xl text-[var(--minimal-ink)] italic">A moment in motion.</h2>
          </div>
        </div>
        {embedUrl ? (
          <div className="aspect-video overflow-hidden bg-black/5">
            <iframe src={embedUrl} title="Video undangan" className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        ) : (
          <a href={invitation.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border border-[var(--minimal-line)] px-5 py-5 text-sm text-[var(--minimal-ink)] transition hover:border-[var(--minimal-accent)]">
            <span>Tonton video undangan</span><ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
    </section>
  );
}
