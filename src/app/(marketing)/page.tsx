import { CalendarCheck, LayoutDashboard, Palette, Zap } from "lucide-react";
import Link from "next/link";

import { TemplateShowcase } from "@/components/marketing/template-showcase";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Palette,
    title: "Template Premium",
    description:
      "Desain yang benar-benar dirancang, bukan template generik — siap pakai untuk berbagai jenis acara.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Modern",
    description:
      "Kelola semua undangan dari satu tempat: draft, published, hingga statistik — tanpa ribet.",
  },
  {
    icon: Zap,
    title: "Publish Instan",
    description:
      "Dari draft ke link yang bisa dibagikan hanya dalam beberapa klik. Tidak perlu menunggu developer.",
  },
  {
    icon: CalendarCheck,
    title: "Siap untuk Semua Acara",
    description:
      "Pernikahan, khitan, ulang tahun, hingga acara formal — satu platform untuk semua momen Anda.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="px-6 pt-24 pb-20 text-center sm:pt-32">
        <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">
          Undangan Digital
        </p>
        <h1 className="font-display text-ink mx-auto mt-5 max-w-2xl text-4xl italic sm:text-5xl">
          Momen berharga Anda, layak tampilan yang sama berharganya.
        </h1>
        <p className="text-ink-soft mx-auto mt-5 max-w-lg">
          Buat undangan digital yang elegan dalam hitungan menit — pilih template premium,
          isi detail acara, publish, bagikan.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="accent" size="lg" asChild>
            <Link href="/dashboard">Mulai Buat Undangan</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/templates">Lihat Template</Link>
          </Button>
        </div>
      </section>

      <section id="fitur" className="border-line bg-surface border-y px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-ink text-3xl italic">
              Semua yang Anda butuhkan
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center sm:text-left">
                <div className="bg-accent-soft mx-auto flex size-10 items-center justify-center rounded-full sm:mx-0">
                  <feature.icon className="text-accent-ink size-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-ink mt-4 font-medium">{feature.title}</h3>
                <p className="text-ink-soft mt-1 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TemplateShowcase />

      <section className="px-6 py-20 text-center">
        <h2 className="font-display text-ink text-3xl italic">
          Siap membuat undangan Anda?
        </h2>
        <p className="text-ink-soft mx-auto mt-3 max-w-sm text-sm">
          Tidak perlu kartu kredit. Mulai buat undangan pertama Anda sekarang.
        </p>
        <div className="mt-6">
          <Button variant="accent" size="lg" asChild>
            <Link href="/dashboard">Mulai Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
