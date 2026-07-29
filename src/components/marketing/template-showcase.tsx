import { Sparkles } from "lucide-react";
import Link from "next/link";

import { templateManifests } from "@/components/invitation/templates/registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Preview "hidup" — iframe ke halaman preview yang sama dengan yang dipakai
 * dashboard (/templates/preview/[slug]), di-scale kecil pakai CSS transform.
 * Sengaja bukan screenshot: begitu template berubah, preview di landing
 * page ikut berubah otomatis, tidak perlu di-generate ulang manual.
 */
export function TemplateShowcase() {
  return (
    <section id="template" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-ink-soft text-xs tracking-[0.3em] uppercase">
            Pilihan Desain
          </p>
          <h2 className="font-display text-ink mt-3 text-3xl italic sm:text-4xl">
            Template premium, siap pakai
          </h2>
          <p className="text-ink-soft mx-auto mt-3 max-w-md text-sm">
            Bukan tangkapan layar — ini template yang sama persis dengan yang akan dipakai
            undangan Anda.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {templateManifests.map((manifest) => (
            <div key={manifest.slug} className="flex flex-col">
              <div className="border-line bg-paper relative h-80 overflow-hidden rounded-xl border">
                {manifest.premium && (
                  <Badge variant="accent" className="absolute top-3 right-3 z-10">
                    <Sparkles className="mr-1 size-3" /> Premium
                  </Badge>
                )}
                <iframe
                  src={`/templates/preview/${manifest.slug}`}
                  title={`Preview template ${manifest.name}`}
                  className="pointer-events-none h-[900px] w-[375px] origin-top-left"
                  style={{ transform: "scale(0.62)" }}
                  tabIndex={-1}
                />
              </div>

              <h3 className="font-display text-ink mt-4 text-lg italic">
                {manifest.name}
              </h3>
              <p className="text-ink-soft mt-1 text-sm">{manifest.description}</p>
              <Button variant="outline" size="sm" className="mt-3 w-fit" asChild>
                <Link href={`/templates/preview/${manifest.slug}`} target="_blank">
                  Lihat penuh
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="accent" asChild>
            <Link href="/templates">Lihat Semua Template</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
