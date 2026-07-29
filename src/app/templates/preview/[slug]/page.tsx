import Link from "next/link";
import { notFound } from "next/navigation";

import { demoInvitationViewModel } from "@/components/invitation/demo-data";
import { getTemplateManifest } from "@/components/invitation/templates/registry";

interface TemplatePreviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TemplatePreviewPage({ params }: TemplatePreviewPageProps) {
  const { slug } = await params;
  const manifest = getTemplateManifest(slug);

  if (!manifest) {
    notFound();
  }

  const Template = manifest.component;

  return (
    <div>
      <div className="border-line bg-surface sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3">
        <Link href="/templates" className="text-ink-soft hover:text-ink text-sm">
          ← Kembali ke katalog
        </Link>
        <span className="text-ink text-sm font-medium">Preview: {manifest.name}</span>
        <Link
          href={`/invitations/new?template=${manifest.slug}`}
          className="bg-accent hover:bg-accent-ink rounded-md px-3 py-1.5 text-sm font-medium text-white"
        >
          Pakai Template Ini
        </Link>
      </div>
      <Template
        invitation={{ ...demoInvitationViewModel, templateSlug: manifest.slug }}
      />
    </div>
  );
}
