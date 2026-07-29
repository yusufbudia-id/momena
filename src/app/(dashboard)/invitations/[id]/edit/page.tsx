import { notFound } from "next/navigation";

import { getTemplateCatalog } from "@/components/invitation/template-catalog";
import { PageHeader } from "@/components/shared/page-header";
import { updateInvitation } from "@/features/invitation/actions";
import { InvitationWizard } from "@/features/invitation/components/invitation-wizard";
import { getInvitationById } from "@/features/invitation/repository";
import type { Gallery, Gift } from "@/features/invitation/types";
import type { InvitationWizardFormValues } from "@/features/invitation/validation";
import { getCurrentUserId } from "@/lib/temp-auth";

interface EditInvitationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvitationPage({ params }: EditInvitationPageProps) {
  const { id } = await params;

  const [invitation, catalog, userId] = await Promise.all([
    getInvitationById(id),
    getTemplateCatalog(),
    getCurrentUserId(),
  ]);

  if (!invitation || invitation.userId !== userId) {
    notFound();
  }

  const templates = catalog.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    thumbnailUrl: item.thumbnail,
    premium: item.premium,
    description: item.description,
  }));

  const defaultValues: Partial<InvitationWizardFormValues> = {
    templateId: invitation.templateId,
    slug: invitation.slug,
    title: invitation.title,
    groomName: invitation.groomName ?? "",
    brideName: invitation.brideName ?? "",
    eventDate: invitation.eventDate
      ? invitation.eventDate.toISOString().slice(0, 10)
      : "",
    eventLocation: invitation.eventLocation ?? "",
    eventAddress: invitation.eventAddress ?? "",
    eventMapsUrl: invitation.eventMapsUrl ?? "",
    description: invitation.description ?? "",
    coverImageUrl: invitation.coverImageUrl ?? "",
    quote: invitation.quote ?? "",
    videoUrl: invitation.videoUrl ?? "",
    gallery: invitation.gallery
      .sort((a: Gallery, b: Gallery) => a.order - b.order)
      .map((item: Gallery) => ({ imageUrl: item.imageUrl, caption: item.caption ?? "" })),
    gifts: invitation.gifts
      .sort((a: Gift, b: Gift) => a.order - b.order)
      .map((item: Gift) =>
        item.method === "BANK_TRANSFER"
          ? {
              method: "BANK_TRANSFER" as const,
              bankName: item.bankName ?? "",
              accountNumber: item.accountNumber ?? "",
              accountHolder: item.accountHolder ?? "",
              note: item.note ?? "",
            }
          : {
              method: "E_WALLET" as const,
              ewalletName: item.ewalletName ?? "",
              ewalletNumber: item.ewalletNumber ?? "",
              note: item.note ?? "",
            },
      ),
  };

  async function updateInvitationAction(rawInput: unknown) {
    "use server";
    return updateInvitation(id, rawInput);
  }

  return (
    <div>
      <PageHeader
        title={`Edit: ${invitation.title}`}
        description="Perbarui detail undangan lewat langkah yang sama seperti saat dibuat."
      />
      <InvitationWizard
        mode="edit"
        defaultValues={defaultValues}
        templates={templates}
        onSubmit={updateInvitationAction}
      />
    </div>
  );
}
