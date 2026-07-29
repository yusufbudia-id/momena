"use client";

import { useState } from "react";

import { MobileSidebar, Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface DashboardLayoutProps {
  breadcrumb: string[];
  children: React.ReactNode;
}

export function DashboardLayout({ breadcrumb, children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-paper flex min-h-dvh">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar breadcrumb={breadcrumb} onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
