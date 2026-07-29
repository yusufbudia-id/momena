import type { TemplateManifest } from "../../types";

import { MinimalTemplate } from "./index";

export const minimalManifest: TemplateManifest = {
  name: "Minimal",
  slug: "minimal",
  author: "Momena",
  version: "1.0.0",
  premium: false,
  thumbnail: "/templates/minimal/thumbnail.jpg",
  description: "Bersih dan simpel — fokus ke informasi acara, tanpa ornamen berlebihan.",
  sections: [
    "Hero",
    "BrideGroom",
    "Countdown",
    "Location",
    "Gallery",
    "Gift",
    "Rsvp",
    "Footer",
  ],
  component: MinimalTemplate,
};
