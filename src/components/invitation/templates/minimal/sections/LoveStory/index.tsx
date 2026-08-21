import type { SectionProps } from "../../../../types";

export function LoveStory({ invitation }: SectionProps) {
  if (invitation.story.length === 0) return null;

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[760px]">
        <div className="border-b border-[var(--minimal-line)] pb-5">
          <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">Our story</p>
          <h2 className="font-display mt-3 text-4xl tracking-[-0.035em] text-[var(--minimal-ink)] italic sm:text-5xl">Small chapters, one story.</h2>
        </div>
        <div className="divide-y divide-[var(--minimal-line)]">
          {invitation.story.map((item, index) => (
            <article key={item.id} className="grid gap-3 py-6 sm:grid-cols-[72px_1fr] sm:gap-6">
              <p className="text-[10px] tracking-[0.24em] text-[var(--minimal-accent)] uppercase">{String(index + 1).padStart(2, "0")}</p>
              <div>
                {item.date && <p className="text-[9px] tracking-[0.22em] text-[var(--minimal-muted)] uppercase">{item.date}</p>}
                <h3 className="font-display mt-1 text-2xl text-[var(--minimal-ink)] italic">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--minimal-muted)]">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
