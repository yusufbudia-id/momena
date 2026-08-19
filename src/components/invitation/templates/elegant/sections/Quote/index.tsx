import type { SectionProps } from "../../../../types";

export function Quote({ invitation }: SectionProps) {
  if (!invitation.quote) return null;

  return (
    <section className="px-6 py-16 text-center">
      <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
        A Sacred Verse
      </p>
      <blockquote className="mx-auto mt-5 max-w-2xl text-balance">
        <p className="font-display text-[1.8rem] leading-[1.45] text-[var(--color-ink)] italic sm:text-[2.35rem]">
          “{invitation.quote}”
        </p>
      </blockquote>
    </section>
  );
}
