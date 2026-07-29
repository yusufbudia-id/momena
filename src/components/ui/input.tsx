import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "border-line bg-surface text-ink placeholder:text-ink-soft/60 h-9 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
