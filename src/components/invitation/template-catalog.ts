import { getActiveTemplates } from "@/features/template/repository";

import { getTemplateManifest } from "./templates/registry";

export interface TemplateCatalogItem {
  /** id row `Template` di database — dipakai sebagai FK `Invitation.templateId`. */
  id: string;
  slug: string;
  name: string;
  thumbnail: string;
  premium: boolean;
  description: string;
}

/**
 * Gabungkan Template dari database (sumber `id`/FK & status aktif) dengan
 * manifest di kode (sumber nama/thumbnail/deskripsi/premium). Kalau ada
 * row di database yang slug-nya belum punya manifest terdaftar, baris itu
 * dilewati — belum bisa dipakai sampai komponennya dibuat.
 */
export async function getTemplateCatalog(): Promise<TemplateCatalogItem[]> {
  const dbTemplates = await getActiveTemplates();

  return dbTemplates.flatMap((dbTemplate) => {
    const manifest = getTemplateManifest(dbTemplate.slug);
    if (!manifest) return [];

    return [
      {
        id: dbTemplate.id,
        slug: dbTemplate.slug,
        name: manifest.name,
        thumbnail: manifest.thumbnail,
        premium: manifest.premium,
        description: manifest.description,
      },
    ];
  });
}
