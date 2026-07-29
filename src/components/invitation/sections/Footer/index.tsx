import type { SectionProps } from "../../types";

export function Footer({ invitation }: SectionProps) {
  return (
    <footer className="border-line border-t px-6 py-10 text-center">
      <p className="font-display text-ink text-lg italic">Terima kasih</p>
      <p className="text-ink-soft mt-1 text-sm">
        atas doa dan restu Anda untuk {invitation.title}.
      </p>
      <p className="text-ink-soft/60 mt-6 text-xs">Dibuat dengan Momena</p>
    </footer>
  );
}
