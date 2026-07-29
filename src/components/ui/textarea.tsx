import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "border-line bg-surface text-ink placeholder:text-ink-soft/60 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
