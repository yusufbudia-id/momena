import type { TemplateManifest } from "../../types";

import { ElegantTemplate } from "./index";

export const elegantManifest: TemplateManifest = {
  name: "Elegant",
  slug: "elegant",
  author: "Momena",
  version: "2.1.0",
  premium: true,
  thumbnail: "/templates/elegant/thumbnail.jpg",
  description:
    "Luxury wedding design system dengan art direction berbeda untuk Noir (cinematic-geometric) dan Ivory (stationery-botanical), dilengkapi cinematic opening, editorial gallery, chapter navigation, RSVP, gift, story, dan guest experience premium.",
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
