import type { SectionProps } from "../../../../types";

export function LoveStory({ invitation }: SectionProps) {
  if (!invitation.story.length) return null;

  return (
    <section className="overflow-hidden bg-[#ffedf4] px-5 py-18 text-[#101218] sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <p className="text-[10px] font-bold tracking-[.35em] text-[var(--modern-violet)] uppercase">Story chapters</p>
        <h2 className="mt-3 text-[clamp(3.8rem,10vw,8rem)] font-black leading-[.78] tracking-[-.07em] uppercase">How we<br />got here.</h2>

        <div className="mt-12">
          {invitation.story.map((item, index) => {
            const year = item.date?.match(/\d{4}/)?.[0] ?? String(index + 1).padStart(2, "0");
            return (
              <article key={item.id} className="relative grid min-h-[52svh] items-center border-t border-black/14 py-10 sm:grid-cols-[.65fr_1.35fr] sm:gap-10 sm:py-14">
                <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[clamp(8rem,28vw,20rem)] font-black leading-none tracking-[-.09em] text-black/[.035]">{year}</div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold tracking-[.28em] text-[#ff4f93] uppercase">Chapter {String(index + 1).padStart(2, "0")}</p>
                  {item.date && <p className="mt-3 text-sm font-semibold text-black/42">{item.date}</p>}
                </div>
                <div className="relative z-10 mt-6 sm:mt-0">
                  <h3 className="text-[clamp(2.6rem,7vw,5.8rem)] font-black leading-[.84] tracking-[-.06em] uppercase">{item.title}</h3>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-black/58 sm:text-base sm:leading-8">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
