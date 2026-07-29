import type { InvitationTemplate, TemplateManifest } from "../types";

import { elegantManifest } from "./elegant/manifest";
import { minimalManifest } from "./minimal/manifest";
import { modernManifest } from "./modern/manifest";

/**
 * Satu-satunya tempat pendaftaran template. Menambah template baru =
 * 1 folder baru (index.tsx + manifest.ts) + 1 baris di sini — TIDAK PERNAH
 * mengubah `src/app/i/[slug]/page.tsx` atau halaman dashboard mana pun.
 */
export const templateManifests: TemplateManifest[] = [
  elegantManifest,
  minimalManifest,
  modernManifest,
];

const manifestBySlug: Record<string, TemplateManifest> = Object.fromEntries(
  templateManifests.map((manifest) => [manifest.slug, manifest]),
);

export function getTemplateManifest(slug: string): TemplateManifest | null {
  return manifestBySlug[slug] ?? null;
}

export function getTemplateComponent(slug: string): InvitationTemplate | null {
  return manifestBySlug[slug]?.component ?? null;
}
