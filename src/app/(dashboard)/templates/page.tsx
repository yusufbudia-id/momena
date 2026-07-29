import { Eye, Sparkles } from "lucide-react";
import Link from "next/link";

import { templateManifests } from "@/components/invitation/templates/registry";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader
        title="Templates"
        description="Pilih desain untuk undangan kamu — preview dulu sebelum dipakai."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templateManifests.map((manifest) => (
          <div
            key={manifest.slug}
            className="border-line bg-surface overflow-hidden rounded-xl border"
          >
            <div className="bg-paper text-ink-soft/50 relative flex aspect-[3/4] items-center justify-center">
              {/* thumbnail asli menunggu aset template */}
              <span className="font-display text-lg italic">{manifest.name}</span>
              {manifest.premium && (
                <Badge variant="accent" className="absolute top-2 right-2">
                  <Sparkles className="mr-1 size-3" /> Premium
                </Badge>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-display text-ink text-lg italic">{manifest.name}</h3>
              <p className="text-ink-soft mt-1 line-clamp-2 text-sm">
                {manifest.description}
              </p>
              <p className="text-ink-soft/60 mt-2 text-xs">
                {manifest.author} · v{manifest.version} · {manifest.sections.length}{" "}
                section
              </p>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/templates/preview/${manifest.slug}`} target="_blank">
                    <Eye className="size-3.5" /> Preview
                  </Link>
                </Button>
                <Button variant="accent" size="sm" className="flex-1" asChild>
                  <Link href={`/invitations/new?template=${manifest.slug}`}>
                    Use Template
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
