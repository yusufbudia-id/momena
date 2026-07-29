import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const statAccent = cva("h-1 w-full rounded-full", {
  variants: {
    tone: {
      ink: "bg-ink",
      accent: "bg-accent",
      success: "bg-success",
      warning: "bg-warning",
    },
  },
  defaultVariants: { tone: "ink" },
});

interface StatCardProps extends VariantProps<typeof statAccent> {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <div className="border-line bg-surface rounded-xl border p-5 shadow-sm">
      <div className={cn(statAccent({ tone }), "mb-4")} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-ink-soft text-sm">{label}</p>
          <p className="text-ink mt-1 text-3xl font-semibold tabular-nums">{value}</p>
        </div>
        <Icon className="text-ink-soft/60 size-5" strokeWidth={1.75} />
      </div>
    </div>
  );
}
