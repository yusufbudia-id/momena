"use client";

import { usePathname } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  invitations: "Invitations",
  templates: "Templates",
  settings: "Settings",
};

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segment = pathname?.split("/").filter(Boolean)[0] ?? "dashboard";
  const breadcrumb = ["Momena", labels[segment] ?? segment];

  return <DashboardLayout breadcrumb={breadcrumb}>{children}</DashboardLayout>;
}
