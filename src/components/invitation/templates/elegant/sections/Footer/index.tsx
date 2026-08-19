import type { SectionProps } from "../../../../types";

export function Footer({ invitation }: SectionProps) {
  const first = invitation.couple?.first ?? invitation.title;
  const second = invitation.couple?.second ?? "";

  return (
    <footer className="px-6 py-[4.5rem] text-center sm:py-24">
      <div aria-hidden className="mx-auto flex max-w-xs items-center justify-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-accent)]/45" />
        <span className="size-1.5 rotate-45 bg-[var(--color-accent)]" />
        <span className="size-1 rotate-45 bg-[var(--color-accent)]/50" />
        <span className="size-1.5 rotate-45 bg-[var(--color-accent)]" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-accent)]/45" />
      </div>

      <p className="mt-8 font-serif text-lg italic text-[var(--color-ink-soft)]">
        Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
      </p>
      <p className="mt-5 text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
        berkenan hadir serta memberikan doa restu.
      </p>

      <div className="mt-8">
        <p className="text-[10px] tracking-[0.45em] text-[var(--color-accent)]/75 uppercase">
          With Love
        </p>
        <h3 className="font-display mt-4 text-[clamp(2.8rem,10vw,4.5rem)] leading-none text-[var(--color-gold-light)] italic">
          {first}
        </h3>
        {second && (
          <>
            <p className="font-display my-1 text-2xl text-[var(--color-accent)]/55 italic">&amp;</p>
            <h3 className="font-display text-[clamp(2.8rem,10vw,4.5rem)] leading-none text-[var(--color-gold-light)] italic">
              {second}
            </h3>
          </>
        )}
      </div>

      <p className="mt-12 text-[10px] tracking-[0.32em] text-[var(--color-ink-soft)]/55 uppercase">
        Dibuat dengan Momena
      </p>
    </footer>
  );
}
