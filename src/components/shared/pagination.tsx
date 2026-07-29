import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageCount: number;
  buildHref: (page: number) => string;
}

export function Pagination({ page, pageCount, buildHref }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="text-ink-soft mt-4 flex items-center justify-between text-sm">
      <span>
        Halaman {page} dari {pageCount}
      </span>
      <div className="flex items-center gap-2">
        <PaginationLink
          href={buildHref(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="size-4" />
        </PaginationLink>
        <PaginationLink
          href={buildHref(page + 1)}
          disabled={page >= pageCount}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="size-4" />
        </PaginationLink>
      </div>
    </div>
  );
}

function PaginationLink({
  href,
  disabled,
  children,
  ...props
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label": string;
}) {
  if (disabled) {
    return (
      <span
        className="border-line text-ink-soft/40 flex size-8 items-center justify-center rounded-md border"
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "border-line hover:bg-paper flex size-8 items-center justify-center rounded-md border",
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
