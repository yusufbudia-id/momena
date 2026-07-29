import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">Momena</p>
      <h1 className="font-display text-ink text-2xl italic">Halaman tidak ditemukan</h1>
      <p className="text-ink-soft max-w-sm text-sm">
        Alamat yang Anda tuju tidak ada, atau sudah dipindahkan.
      </p>
      <Link href="/" className="text-accent mt-4 text-sm font-medium hover:underline">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
