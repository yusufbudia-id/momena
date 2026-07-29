import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-line border-t px-6 py-10">
      <div className="text-ink-soft mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <span className="font-display text-ink italic">Momena</span>
        <p>Platform undangan digital untuk momen berharga Anda.</p>
        <div className="flex gap-4">
          <Link href="/templates" className="hover:text-ink">
            Template
          </Link>
          <Link href="/dashboard" className="hover:text-ink">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
