import type { ComponentType } from "react";

import type { InvitationViewModel } from "./view-model";

export type { InvitationViewModel } from "./view-model";

/**
 * Data yang diterima setiap section & template — ViewModel, BUKAN entity
 * Prisma. Section tidak boleh tahu ia dipanggil dari template mana, dan
 * tidak boleh tahu bentuk tabel database (lihat mapper.ts).
 */
export interface SectionProps {
  invitation: InvitationViewModel;
  /**
   * Nama tamu dari URL (`?to=...`) — konteks PER KUNJUNGAN, bukan bagian
   * data invitation itu sendiri (makanya bukan di ViewModel). Opsional,
   * section boleh mengabaikannya kalau tidak relevan.
   */
  guestName?: string;
}

export type InvitationTemplate = ComponentType<SectionProps>;

/**
 * Metadata satu template — hidup di kode (co-located dengan komponennya),
 * bukan di database. Database (`Template` table) tetap sumber untuk `id`
 * (dipakai sebagai FK relasi) & `isActive`; manifest ini sumber untuk
 * segala hal yang berkaitan dengan tampilan/render.
 */
export interface TemplateManifest {
  name: string;
  /** Harus sama persis dengan `template.slug` di database & key di registry. */
  slug: string;
  author: string;
  version: string;
  premium: boolean;
  thumbnail: string;
  description: string;
  /** Section yang dipakai template ini, untuk dokumentasi & preview admin. */
  sections: string[];
  component: InvitationTemplate;
}
