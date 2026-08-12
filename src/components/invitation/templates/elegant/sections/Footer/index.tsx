import type { SectionProps } from "../../../../types";

/**
 * Footer lokal Elegant — penutup bergaya kartu undangan resmi: ornamen
 * diamond kecil, nama mempelai sebagai tanda tangan penutup.
 */
export function Footer({ invitation }: SectionProps) {
  const coupleName = invitation.couple
    ? `${invitation.couple.first} & ${invitation.couple.second}`
    : invitation.title;

  return (
    <footer className="border-t border-[var(--color-line)] px-6 py-16 text-center">
      <div aria-hidden className="mx-auto mb-6 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-[var(--color-accent)]/40" />
        <span className="size-1.5 rotate-45 bg-[var(--color-accent)]" />
        <span className="h-px w-10 bg-[var(--color-accent)]/40" />
      </div>

      <p className="font-display text-2xl text-[var(--color-ink)] italic">Terima Kasih</p>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Atas doa dan restu Anda untuk kebahagiaan kami,
      </p>
      <p className="font-display mt-1 text-lg text-[var(--color-accent-ink)] italic">
        {coupleName}
      </p>

      <p className="mt-10 text-[10px] tracking-[0.3em] text-[var(--color-ink-soft)]/60 uppercase">
        Dibuat dengan Momena
      </p>
    </footer>
  );
}
