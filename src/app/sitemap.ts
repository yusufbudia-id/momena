import type { MetadataRoute } from "next";

import { templateManifests } from "@/components/invitation/templates/registry";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/templates`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const previewRoutes: MetadataRoute.Sitemap = templateManifests.map((manifest) => ({
    url: `${siteUrl}/templates/preview/${manifest.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...previewRoutes];
}
