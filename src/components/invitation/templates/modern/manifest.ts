import type { TemplateManifest } from "../../types";

import { ModernTemplate } from "./index";

export const modernManifest: TemplateManifest = {
  name: "Modern",
  slug: "modern",
  author: "Momena",
  version: "3.0.0",
  premium: true,
  thumbnail: "/templates/modern/thumbnail.jpg",
  description: "Experimental digital editorial, full-bleed, dan expressive — untuk pasangan dengan energi modern.",
  sections: [
    "Gallery",
    "Hero",
    "BrideGroom",
    "Video",
    "Countdown",
    "Location",
    "LoveStory",
    "Quote",
    "Gift",
    "Rsvp",
    "Footer",
  ],
  component: ModernTemplate,
};
