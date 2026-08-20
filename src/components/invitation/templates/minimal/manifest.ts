import type { TemplateManifest } from "../../types";
import { MinimalTemplate } from "./index";

export const minimalManifest: TemplateManifest = {
  name: "Minimal",
  slug: "minimal",
  author: "Momena",
  version: "2.0.0",
  premium: false,
  thumbnail: "/templates/minimal/thumbnail.jpg",
  description: "Editorial minimal dengan whitespace lega, tipografi kuat, dan foto sebagai pusat visual.",
  sections: [
    "Hero",
    "Welcome",
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
