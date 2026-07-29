"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 px-6 text-center">
      <h2 className="font-display text-ink text-xl italic">Halaman ini gagal dimuat</h2>
      <p className="text-ink-soft max-w-sm text-sm">
        Coba muat ulang halaman ini. Kalau masih gagal, coba kembali ke Dashboard.
      </p>
      <div className="mt-2 flex gap-2">
        <Button variant="outline" onClick={reset}>
          Coba Lagi
        </Button>
        <Button variant="accent" asChild>
          <a href="/dashboard">Ke Dashboard</a>
        </Button>
      </div>
    </div>
  );
}
