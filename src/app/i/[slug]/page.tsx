import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { toInvitationViewModel } from "@/components/invitation/mapper";
import { getTemplateComponent } from "@/components/invitation/templates/registry";
import { getInvitationBySlug } from "@/features/invitation/repository";

interface InvitationPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

export async function generateMetadata({
  params,
}: InvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation || invitation.status !== "PUBLISHED") {
    return { title: "Undangan Tidak Ditemukan | Momena" };
  }

  const description = invitation.description
    ? invitation.description.slice(0, 160)
    : `Kami mengundang Anda untuk hadir di ${invitation.title}.`;

  return {
    title: `${invitation.title} | Momena`,
    description,
    openGraph: {
      title: invitation.title,
      description,
      images: invitation.coverImageUrl ? [{ url: invitation.coverImageUrl }] : undefined,
    },
  };
}

/**
 * Engine: Cari Invitation → 404 kalau tidak ada/belum publish → petakan ke
 * ViewModel → cari komponen lewat Template Registry → render. Halaman ini
 * TIDAK PERNAH tahu isi/layout template, dan tidak pernah meneruskan entity
 * Prisma mentah ke template — selalu lewat mapper (lihat components/invitation/mapper.ts).
 */
export default async function InvitationPage({
  params,
  searchParams,
}: InvitationPageProps) {
  const [{ slug }, { to }] = await Promise.all([params, searchParams]);
  const invitation = await getInvitationBySlug(slug);

  // Draft/archived sengaja ikut 404 di sisi publik — link baru "hidup"
  // setelah invitation di-publish dari dashboard.
  if (!invitation || invitation.status !== "PUBLISHED") {
    notFound();
  }

  const Template = getTemplateComponent(invitation.template.slug);

  // Template terdaftar di database tapi belum ada komponennya di registry.
  if (!Template) {
    notFound();
  }

  return <Template invitation={toInvitationViewModel(invitation)} guestName={to} />;
}
