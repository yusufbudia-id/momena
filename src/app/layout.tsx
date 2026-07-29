import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

import "@/app/globals.css";
import { fontDisplay, fontSans } from "@/lib/fonts";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Dynamic viewport (100dvh) + safe area iPhone (notch/home indicator).
  viewportFit: "cover",
  themeColor: "#8c4f63",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Momena — Undangan Digital",
    template: "%s | Momena",
  },
  description:
    "Buat undangan digital yang elegan dalam hitungan menit — pilih template premium, isi detail acara, publish, bagikan.",
  applicationName: "Momena",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Momena",
    title: "Momena — Undangan Digital",
    description:
      "Buat undangan digital yang elegan dalam hitungan menit — pilih template premium, isi detail acara, publish, bagikan.",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Momena — Undangan Digital",
    description:
      "Buat undangan digital yang elegan dalam hitungan menit — pilih template premium, isi detail acara, publish, bagikan.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Momena",
  url: siteUrl,
  description: "Platform undangan digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
