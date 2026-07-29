import type { TemplateManifest } from "../../types";

import { ElegantTemplate } from "./index";

export const elegantManifest: TemplateManifest = {
  name: "Elegant",
  slug: "elegant",
  author: "Momena",
  version: "1.0.0",
  premium: true,
  thumbnail: "/templates/elegant/thumbnail.jpg",
  description:
    "Nuansa klasik nan mewah — cocok untuk pernikahan tradisional maupun modern.",
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
