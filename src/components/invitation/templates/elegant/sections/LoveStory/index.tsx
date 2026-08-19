import type { SectionProps } from "../../../../types";

export function LoveStory({ invitation }: SectionProps) {
  if (invitation.story.length === 0) return null;

  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
          Our Story
        </p>
        <h2 className="font-display mt-3 text-3xl italic text-[var(--color-ink)] sm:text-4xl">
          Kisah Kami
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
          Setiap pertemuan, doa, dan langkah kecil membawa kami sampai pada momen ini.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-2xl">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent)]/60 via-[var(--color-accent)]/20 to-transparent sm:left-1/2 sm:-translate-x-px" />

        <div className="flex flex-col gap-8 sm:gap-10">
          {invitation.story.map((item, index) => {
            const right = index % 2 === 1;
            return (
              <div
                key={item.id}
                className={`relative sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-6 ${right ? "" : ""}`}
              >
                <div className={`${right ? "sm:col-start-3" : "sm:col-start-1"} pl-14 sm:pl-0 ${right ? "sm:text-left" : "sm:text-right"}`}>
                  <div className="border border-[var(--color-accent)]/18 bg-[var(--color-surface)]/72 px-5 py-5 shadow-[inset_0_0_40px_rgba(201,162,92,.02),0_16px_40px_rgba(0,0,0,.16)] backdrop-blur-sm">
                    {item.date && (
                      <p className="text-[10px] tracking-[0.32em] text-[var(--color-accent)] uppercase">
                        {item.date}
                      </p>
                    )}
                    <h3 className="font-display mt-2 text-2xl italic text-[var(--color-ink)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="absolute left-0 top-6 flex items-center gap-3 sm:static sm:col-start-2 sm:justify-center">
                  <span className="flex size-10 items-center justify-center border border-[var(--color-accent)]/40 bg-[var(--color-surface)] text-sm tracking-[0.25em] text-[var(--color-gold-light)] shadow-[0_10px_28px_rgba(0,0,0,.18)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
