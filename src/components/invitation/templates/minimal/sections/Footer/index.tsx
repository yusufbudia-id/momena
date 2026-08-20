import type { SectionProps } from "../../../../types";

export function Footer({ invitation }: SectionProps) {
  const first = invitation.couple?.first ?? invitation.title;
  const second = invitation.couple?.second ?? "";
  return (
    <footer className="px-5 pt-16 pb-28 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-[720px] border-t border-[var(--minimal-line)] pt-10 text-center">
        <p className="text-[9px] tracking-[0.32em] text-[var(--minimal-muted)] uppercase">Thank You</p>
        <p className="font-display mt-5 text-4xl tracking-[-0.04em] text-[var(--minimal-ink)] italic sm:text-5xl">
          {first}{second ? ` & ${second}` : ""}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--minimal-muted)]">
          Terima kasih telah menjadi bagian dari cerita dan hari bahagia kami.
        </p>
        <div className="mx-auto mt-10 h-px w-12 bg-[var(--minimal-line-strong)]" />
        <p className="mt-6 text-[9px] tracking-[0.28em] text-[var(--minimal-muted)]/65 uppercase">Made with Momena</p>
      </div>
    </footer>
  );
}
