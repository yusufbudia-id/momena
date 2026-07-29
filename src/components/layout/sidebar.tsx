"use client";

import { LayoutDashboard, Mail, Palette, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invitations", label: "Invitations", icon: Mail },
  { href: "/templates", label: "Templates", icon: Palette },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent-soft text-accent-ink"
                : "text-ink-soft hover:bg-paper hover:text-ink",
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className="flex h-16 items-center px-5">
      <span className="font-display text-ink text-xl italic">Momena</span>
    </div>
  );
}

/** Sidebar desktop — fixed, selalu tampil di layar md ke atas. */
export function Sidebar() {
  return (
    <aside className="border-line bg-surface hidden w-64 shrink-0 flex-col border-r md:flex">
      <SidebarBrand />
      <NavList />
      <div className="text-ink-soft/70 p-3 text-xs">v0.1 — MVP+</div>
    </aside>
  );
}

/** Sidebar mobile — drawer yang muncul di atas konten, ditutup lewat backdrop/tombol X. */
export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        aria-label="Tutup menu"
        className="bg-ink/30 absolute inset-0"
        onClick={onClose}
      />
      <div className="border-line bg-surface relative flex h-full w-72 max-w-[80%] flex-col border-r">
        <div className="flex h-16 items-center justify-between px-5">
          <span className="font-display text-ink text-xl italic">Momena</span>
          <button
            aria-label="Tutup menu"
            onClick={onClose}
            className="text-ink-soft hover:bg-paper rounded-md p-1.5"
          >
            <X className="size-5" />
          </button>
        </div>
        <NavList onNavigate={onClose} />
      </div>
    </div>
  );
}
