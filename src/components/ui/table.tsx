import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="border-line bg-surface w-full overflow-x-auto rounded-xl border">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-line bg-paper/60 border-b text-left", className)}
      {...props}
    />
  );
}

function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-line divide-y", className)} {...props} />;
}

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("hover:bg-paper/50 transition-colors", className)} {...props} />
  );
}

function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "text-ink-soft px-4 py-3 text-xs font-medium tracking-wide uppercase",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("text-ink px-4 py-3 align-middle", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
