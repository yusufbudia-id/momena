import type { TemplateManifest } from "../../types";

import { ElegantTemplate } from "./index";

export const elegantManifest: TemplateManifest = {
  name: "Elegant",
  slug: "elegant",
  author: "Momena",
  version: "2.0.0",
  premium: true,
  thumbnail: "/templates/elegant/thumbnail.jpg",
  description:
    "Luxury wedding experience dengan dua arah visual: Noir yang dramatis dan Ivory yang lembut, dilengkapi cinematic opening, editorial gallery, RSVP, gift, story, dan guest experience premium.",
  sections: [
    "Hero",
    "BrideGroom",
    "Location",
    "Countdown",
    "Gallery",
    "LoveStory",
    "Quote",
    "Video",
    "Gift",
    "Rsvp",
    "Footer",
  ],
  component: ElegantTemplate,
};
