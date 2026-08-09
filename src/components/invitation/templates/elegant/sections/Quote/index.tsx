import type { SectionProps } from "../../../../types";

export function Quote({ invitation }: SectionProps) {
  if (!invitation.quote) return null;

  return (
    <section className="px-6 py-16 text-center">
      <blockquote className="font-display text-ink mx-auto max-w-lg text-xl leading-relaxed italic">
        “{invitation.quote}”
      </blockquote>
    </section>
  );
}
