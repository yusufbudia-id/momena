import { Archive, CheckCircle2, FileEdit, Mail } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { getInvitationStats } from "@/features/invitation/repository";
import { getCurrentUserId } from "@/lib/temp-auth";

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  const stats = await getInvitationStats(userId);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan aktivitas undangan kamu di Momena."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Invitation" value={stats.total} icon={Mail} tone="ink" />
        <StatCard
          label="Published"
          value={stats.published}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard label="Draft" value={stats.draft} icon={FileEdit} tone="warning" />
        <StatCard label="Archived" value={stats.archived} icon={Archive} tone="accent" />
      </div>
    </div>
  );
}
