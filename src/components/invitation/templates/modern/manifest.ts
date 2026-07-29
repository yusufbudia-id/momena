import type { TemplateManifest } from "../../types";

import { ModernTemplate } from "./index";

export const modernManifest: TemplateManifest = {
  name: "Modern",
  slug: "modern",
  author: "Momena",
  version: "1.0.0",
  premium: true,
  thumbnail: "/templates/modern/thumbnail.jpg",
  description: "Full-bleed dan video-forward — untuk pasangan yang ingin tampil beda.",
  sections: [
    "Gallery",
    "Hero",
    "BrideGroom",
    "Video",
    "Countdown",
    "Location",
    "Quote",
    "Gift",
    "Rsvp",
    "Footer",
  ],
  component: ModernTemplate,
};
