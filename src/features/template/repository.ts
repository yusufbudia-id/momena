import { db } from "@/lib/db";

import type { Template } from "./types";

/**
 * Repository layer untuk Template.
 * Semua akses `prisma.template.*` HARUS lewat sini.
 */

export async function getActiveTemplates(): Promise<Template[]> {
  return db.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTemplateById(id: string): Promise<Template | null> {
  return db.template.findUnique({ where: { id } });
}

export async function getTemplateBySlug(slug: string): Promise<Template | null> {
  return db.template.findUnique({ where: { slug } });
}
