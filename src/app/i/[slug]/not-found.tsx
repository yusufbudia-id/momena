import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">Momena</p>
      <h1 className="font-display text-ink text-2xl italic">Undangan tidak ditemukan</h1>
      <p className="text-ink-soft text-sm">
        Link ini mungkin salah ketik, atau undangannya belum dipublish oleh pemiliknya.
      </p>
      <Link href="/" className="text-accent mt-4 text-sm font-medium hover:underline">
        Kembali ke Momena
      </Link>
    </div>
  );
}
