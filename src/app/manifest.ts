import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Momena — Undangan Digital",
    short_name: "Momena",
    description: "Platform undangan digital untuk momen berharga Anda.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f3",
    theme_color: "#8c4f63",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
