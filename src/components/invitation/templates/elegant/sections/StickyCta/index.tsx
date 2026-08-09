import type { SectionProps } from "../../../../types";

/**
 * Bar CTA yang menempel di bawah layar selama guest scroll — mayoritas
 * tamu membuka undangan lewat HP, jadi ajakan konfirmasi harus selalu
 * kelihatan, bukan cuma di bagian RSVP.
 */
export function StickyCta({ invitation: _invitation }: SectionProps) {
  return (
    <div className="safe-bottom border-line bg-surface/95 sticky bottom-0 z-30 border-t px-4 py-3 backdrop-blur">
      <a
        href="#rsvp"
        className="bg-accent hover:bg-accent-ink mx-auto flex h-11 max-w-md items-center justify-center rounded-full text-sm font-medium text-white"
      >
        Konfirmasi Kehadiran
      </a>
    </div>
  );
}
