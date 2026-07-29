import type { SectionProps } from "../../types";

export function BrideGroom({ invitation }: SectionProps) {
  if (!invitation.couple) return null;

  return (
    <section className="px-6 py-16 text-center">
      <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">Kedua Mempelai</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
        <div>
          <p className="font-display text-ink text-3xl italic">
            {invitation.couple.first}
          </p>
        </div>
        <span className="text-accent text-2xl">&</span>
        <div>
          <p className="font-display text-ink text-3xl italic">
            {invitation.couple.second}
          </p>
        </div>
      </div>
    </section>
  );
}
