import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="border-line bg-surface flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
      <div className="bg-accent-soft mb-4 flex size-12 items-center justify-center rounded-full">
        <Icon className="text-accent-ink size-6" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-ink text-lg italic">{title}</h3>
      {description && (
        <p className="text-ink-soft mt-1 max-w-sm text-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
