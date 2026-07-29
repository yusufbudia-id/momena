import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/templates"],
        // /dashboard & /invitations: area admin, tidak untuk publik.
        // /i/: link undangan bersifat privat (dibagikan langsung ke tamu,
        // bukan untuk diindeks mesin pencari).
        disallow: ["/dashboard", "/invitations", "/i/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
