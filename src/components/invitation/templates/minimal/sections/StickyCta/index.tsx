import type { SectionProps } from "../../../../types";

export function StickyCta({ invitation: _invitation }: SectionProps) {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 px-4 pb-4 sm:hidden">
      <a href="#rsvp" className="mx-auto flex h-12 max-w-md items-center justify-center bg-[var(--minimal-ink)] text-[10px] tracking-[0.24em] text-white uppercase shadow-[0_12px_38px_rgba(30,28,25,.18)]">
        Konfirmasi Kehadiran
      </a>
    </div>
  );
}
