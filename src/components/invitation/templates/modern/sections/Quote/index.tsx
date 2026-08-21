import type { SectionProps } from "../../../../types";

export function Quote({ invitation }: SectionProps) {
  if (!invitation.quote) return null;
  return (
    <section className="relative flex min-h-[78svh] items-center overflow-hidden bg-[#0b0d13] px-5 py-20 text-white sm:px-8 lg:px-12">
      <div className="absolute -left-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-[var(--modern-violet)]/20 blur-3xl" />
      <div className="absolute -right-20 top-1/3 size-64 rounded-full bg-[#ff5f9f]/16 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1500px]">
        <p className="text-[10px] tracking-[.35em] text-[#d8ff58] uppercase">Words to keep</p>
        <blockquote className="mt-7 max-w-[1300px] text-[clamp(2.6rem,7vw,7rem)] font-black leading-[.92] tracking-[-.06em] text-white/94">
          “{invitation.quote}”
        </blockquote>
      </div>
    </section>
  );
}
