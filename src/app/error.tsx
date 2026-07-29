"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">Momena</p>
      <h1 className="font-display text-ink text-2xl italic">Ada yang tidak beres</h1>
      <p className="text-ink-soft max-w-sm text-sm">
        Terjadi kesalahan saat memuat halaman ini. Coba muat ulang, atau kembali beberapa
        saat lagi.
      </p>
      <Button variant="accent" onClick={reset} className="mt-2">
        Coba Lagi
      </Button>
    </div>
  );
}
