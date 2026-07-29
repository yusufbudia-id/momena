"use client";

import { ChevronRight, Menu, Search } from "lucide-react";
import { Fragment } from "react";

interface TopbarProps {
  breadcrumb: string[];
  onOpenMenu: () => void;
}

export function Topbar({ breadcrumb, onOpenMenu }: TopbarProps) {
  return (
    <header className="border-line bg-surface flex h-16 items-center gap-4 border-b px-4 md:px-6">
      <button
        aria-label="Buka menu"
        onClick={onOpenMenu}
        className="text-ink-soft hover:bg-paper rounded-md p-1.5 md:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="text-ink-soft flex items-center gap-1.5 text-sm">
        {breadcrumb.map((crumb, i) => (
          <Fragment key={crumb}>
            {i > 0 && <ChevronRight className="text-ink-soft/50 size-3.5" />}
            <span className={i === breadcrumb.length - 1 ? "text-ink font-medium" : ""}>
              {crumb}
            </span>
          </Fragment>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="border-line bg-paper text-ink-soft hidden items-center gap-2 rounded-md border px-3 py-1.5 text-sm sm:flex">
          <Search className="size-4" />
          <span>Cari invitation…</span>
        </div>

        {/* Dummy user menu — belum terhubung ke session Auth.js */}
        <div className="bg-accent flex size-9 items-center justify-center rounded-full text-sm font-medium text-white">
          A
        </div>
      </div>
    </header>
  );
}
