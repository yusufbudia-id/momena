import type { SectionProps } from "../../../../types";

export function StickyCta({ invitation: _invitation }: SectionProps) {
  return (
    <div className="safe-bottom sticky bottom-0 z-30 border-t border-[var(--color-accent)]/15 bg-[var(--luxe-sticky)] px-4 py-3 backdrop-blur-md">
      <a
        href="#rsvp"
        className="mx-auto flex h-11 max-w-md items-center justify-center border border-[var(--color-accent)]/55 px-5 text-[10px] tracking-[0.28em] text-[var(--color-accent-ink)] uppercase transition-all hover:bg-[var(--color-accent)] hover:text-[var(--luxe-button-ink)]"
      >
        Konfirmasi Kehadiran
      </a>
    </div>
  );
}
