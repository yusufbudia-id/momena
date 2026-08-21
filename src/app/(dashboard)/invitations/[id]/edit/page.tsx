import { notFound } from "next/navigation";

import { getTemplateCatalog } from "@/components/invitation/template-catalog";
import { PageHeader } from "@/components/shared/page-header";
import { updateInvitation } from "@/features/invitation/actions";
import { InvitationWizard } from "@/features/invitation/components/invitation-wizard";
import { getInvitationById } from "@/features/invitation/repository";
import type { Gallery, Gift, InvitationEvent, Story } from "@/features/invitation/types";
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

  const sortedGallery = [...invitation.gallery].sort((a: Gallery, b: Gallery) => a.order - b.order);
  const sortedEvents = [...invitation.events].sort((a: InvitationEvent, b: InvitationEvent) => a.order - b.order);
  const eventDefaults = sortedEvents.length > 0
    ? sortedEvents.map((event: InvitationEvent) => ({ type:event.type, title:event.title, eventDate:event.eventDate ? event.eventDate.toISOString().slice(0,10) : "", startTime:event.startTime ?? "", endTime:event.endTime ?? "", location:event.location ?? "", address:event.address ?? "", mapsUrl:event.mapsUrl ?? "" }))
    : invitation.eventDate || invitation.eventLocation || invitation.eventAddress || invitation.eventMapsUrl
      ? [{ type:"OTHER", title:"Acara Utama", eventDate:invitation.eventDate ? invitation.eventDate.toISOString().slice(0,10) : "", startTime:"", endTime:"", location:invitation.eventLocation ?? "", address:invitation.eventAddress ?? "", mapsUrl:invitation.eventMapsUrl ?? "" }]
      : [{ type:"AKAD", title:"Akad Nikah", eventDate:"", startTime:"", endTime:"", location:"", address:"", mapsUrl:"" }, { type:"RESEPSI", title:"Resepsi", eventDate:"", startTime:"", endTime:"", location:"", address:"", mapsUrl:"" }];

  const defaultValues: Partial<InvitationWizardFormValues> = {
    templateId: invitation.templateId,
    slug: invitation.slug,
    title: invitation.title,
    groomName: invitation.groomName ?? "",
    brideName: invitation.brideName ?? "",
    groomParents: invitation.groomParents ?? "",
    brideParents: invitation.brideParents ?? "",
    groomInstagram: invitation.groomInstagram ?? "",
    brideInstagram: invitation.brideInstagram ?? "",
    eventDate: invitation.eventDate
      ? invitation.eventDate.toISOString().slice(0, 10)
      : "",
    eventLocation: invitation.eventLocation ?? "",
    eventAddress: invitation.eventAddress ?? "",
    eventMapsUrl: invitation.eventMapsUrl ?? "",
    events: eventDefaults,
    description: invitation.description ?? "",
    coverImageUrl: invitation.coverImageUrl ?? "",
    coverImagePublicId: invitation.coverImagePublicId ?? "",
    coverImagePositionX: invitation.coverImagePositionX,
    coverImagePositionY: invitation.coverImagePositionY,
    // Invitation lama masih bisa menampilkan portrait dari gallery[0].
    // Hydrate URL-nya ke editor agar focal point bisa diatur tanpa upload ulang.
    // Public ID sengaja tidak diwariskan supaya mengganti portrait tidak menghapus asset gallery lama.
    groomPhotoUrl: invitation.groomPhotoUrl ?? sortedGallery[0]?.imageUrl ?? "",
    groomPhotoPublicId: invitation.groomPhotoPublicId ?? "",
    groomPhotoPositionX: invitation.groomPhotoPositionX,
    groomPhotoPositionY: invitation.groomPhotoPositionY,
    bridePhotoUrl: invitation.bridePhotoUrl ?? sortedGallery[1]?.imageUrl ?? "",
    bridePhotoPublicId: invitation.bridePhotoPublicId ?? "",
    bridePhotoPositionX: invitation.bridePhotoPositionX,
    bridePhotoPositionY: invitation.bridePhotoPositionY,
    quote: invitation.quote ?? "",
    videoUrl: invitation.videoUrl ?? "",
    settings: {
      showGallery: invitation.settings?.showGallery ?? true,
      showRsvp: invitation.settings?.showRsvp ?? true,
      showGift: invitation.settings?.showGift ?? true,
      showStory: invitation.settings?.showStory ?? true,
      showVideo: invitation.settings?.showVideo ?? true,
      musicUrl: invitation.settings?.musicUrl ?? "",
      templateVariant: invitation.settings?.templateVariant ?? "",
      accentColor: invitation.settings?.accentColor ?? "",
    },
    gallery: sortedGallery.map((item: Gallery) => ({
        imageUrl: item.imageUrl,
        imagePublicId: item.imagePublicId ?? "",
        caption: item.caption ?? "",
      })),
    stories: invitation.stories
      .sort((a: Story, b: Story) => a.order - b.order)
      .map((item: Story) => ({
        title: item.title,
        date: item.date ?? "",
        description: item.description,
      })),
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
