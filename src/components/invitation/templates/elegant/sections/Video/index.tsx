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
    <section className="px-6 py-16 text-center">
      <h2 className="font-display text-ink text-2xl italic">Video</h2>
      <div className="border-line bg-surface mx-auto mt-6 max-w-2xl overflow-hidden rounded-xl border">
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
            className="text-accent block p-6 text-sm font-medium hover:underline"
          >
            Tonton video
          </a>
        )}
      </div>
    </section>
  );
}
