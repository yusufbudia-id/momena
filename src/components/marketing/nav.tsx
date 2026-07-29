import Link from "next/link";

import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="border-line bg-surface/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-ink text-xl italic">
          Momena
        </Link>

        <nav className="text-ink-soft hidden items-center gap-6 text-sm sm:flex">
          <Link href="/templates" className="hover:text-ink">
            Template
          </Link>
          <Link href="#fitur" className="hover:text-ink">
            Fitur
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Masuk</Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <Link href="/dashboard">Coba Gratis</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
