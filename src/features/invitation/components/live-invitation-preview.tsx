"use client";

import { Eye, MonitorSmartphone } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getTemplateComponent } from "@/components/invitation/templates/registry";
import type { InvitationViewModel } from "@/components/invitation/view-model";
import { cn } from "@/lib/utils";

import type { InvitationWizardFormValues } from "../validation";

interface TemplateOption {
  id: string;
  name: string;
  slug: string;
}

interface LiveInvitationPreviewProps {
  values: InvitationWizardFormValues;
  templates: TemplateOption[];
}

function toDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function fallback(value?: string | null) {
  return value?.trim() ? value : null;
}

function buildPreviewViewModel(
  values: InvitationWizardFormValues,
  templateSlug: string,
): InvitationViewModel {
  const events = (values.events ?? []).map((event, index) => ({
    id: `preview-event-${index}`,
    type: event.type || "OTHER",
    title: event.title || `Event ${index + 1}`,
    eventDate: toDate(event.eventDate),
    startTime: fallback(event.startTime),
    endTime: fallback(event.endTime),
    location: fallback(event.location),
    address: fallback(event.address),
    mapsUrl: fallback(event.mapsUrl),
  }));
  const primaryEvent = events[0];

  return {
    id: "editor-preview",
    slug: values.slug || "preview",
    title: values.title || "Undangan Pernikahan",
    couple:
      values.groomName || values.brideName
        ? {
            first: values.groomName || "Mempelai Pria",
            second: values.brideName || "Mempelai Wanita",
            firstParents: fallback(values.groomParents),
            secondParents: fallback(values.brideParents),
            firstInstagram: fallback(values.groomInstagram),
            secondInstagram: fallback(values.brideInstagram),
          }
        : null,
    tagline: fallback(values.description?.split("\n")[0]),
    quote: fallback(values.quote),
    description: fallback(values.description),
    coverImageUrl: fallback(values.coverImageUrl),
    coverImagePositionX: values.coverImagePositionX ?? 50,
    coverImagePositionY: values.coverImagePositionY ?? 50,
    groomPhotoUrl: fallback(values.groomPhotoUrl) ?? fallback(values.gallery?.[0]?.imageUrl),
    groomPhotoPositionX: values.groomPhotoPositionX ?? 50,
    groomPhotoPositionY: values.groomPhotoPositionY ?? 50,
    bridePhotoUrl: fallback(values.bridePhotoUrl) ?? fallback(values.gallery?.[1]?.imageUrl),
    bridePhotoPositionX: values.bridePhotoPositionX ?? 50,
    bridePhotoPositionY: values.bridePhotoPositionY ?? 50,
    videoUrl: fallback(values.videoUrl),
    eventDate: primaryEvent?.eventDate ?? toDate(values.eventDate),
    eventLocation: primaryEvent?.location ?? fallback(values.eventLocation),
    eventAddress: primaryEvent?.address ?? fallback(values.eventAddress),
    eventMapsUrl: primaryEvent?.mapsUrl ?? fallback(values.eventMapsUrl),
    events,
    gallery: (values.gallery ?? []).map((photo, index) => ({
      id: `preview-gallery-${index}`,
      imageUrl: photo.imageUrl,
      caption: fallback(photo.caption),
    })),
    gifts: (values.gifts ?? []).map((gift, index) =>
      gift.method === "BANK_TRANSFER"
        ? {
            id: `preview-gift-${index}`,
            label: gift.bankName || "Bank",
            number: fallback(gift.accountNumber),
            holderName: fallback(gift.accountHolder),
            note: fallback(gift.note),
            qrImageUrl: fallback(gift.qrImageUrl),
          }
        : {
            id: `preview-gift-${index}`,
            label: gift.ewalletName || "E-Wallet",
            number: fallback(gift.ewalletNumber),
            holderName: null,
            note: fallback(gift.note),
            qrImageUrl: fallback(gift.qrImageUrl),
          },
    ),
    story: (values.stories ?? []).map((story, index) => ({
      id: `preview-story-${index}`,
      title: story.title || `Momen ${index + 1}`,
      date: fallback(story.date),
      description: story.description || "Cerita akan tampil di sini.",
    })),
    guestBook: [],
    templateSlug,
    settings: {
      showGallery: values.settings?.showGallery ?? true,
      showRsvp: values.settings?.showRsvp ?? true,
      showGift: values.settings?.showGift ?? true,
      showStory: values.settings?.showStory ?? true,
      showVideo: values.settings?.showVideo ?? true,
      templateVariant: fallback(values.settings?.templateVariant),
      accentColor: fallback(values.settings?.accentColor),
      fontFamily: fallback(values.settings?.fontFamily) ?? "default",
      heroLayout: fallback(values.settings?.heroLayout) ?? "default",
      decorationLevel: fallback(values.settings?.decorationLevel) ?? "medium",
    },
    musicUrl: null,
    isPreview: true,
    editorPreview: true,
  };
}

export function LiveInvitationPreview({ values, templates }: LiveInvitationPreviewProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const selectedTemplate = templates.find((template) => template.id === values.templateId);
  const Template = selectedTemplate ? getTemplateComponent(selectedTemplate.slug) : null;

  const invitation = useMemo(
    () => buildPreviewViewModel(values, selectedTemplate?.slug ?? "elegant"),
    [selectedTemplate?.slug, values],
  );

  const preview = Template ? (
    <div className="h-full w-full overflow-y-auto overscroll-contain bg-black">
      <div className="min-h-full w-full">
        <Template invitation={invitation} guestName="Tamu Undangan" />
      </div>
    </div>
  ) : (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 bg-neutral-950 px-8 text-center text-white/60">
      <MonitorSmartphone className="size-8" />
      <div>
        <p className="text-sm font-medium text-white">Pilih template</p>
        <p className="mt-1 text-xs leading-5">Preview langsung akan muncul setelah template dipilih.</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="xl:hidden">
        <Button type="button" variant="outline" className="w-full" onClick={() => setMobileOpen((open) => !open)}>
          <Eye className="size-4" />
          {mobileOpen ? "Tutup Live Preview" : "Buka Live Preview"}
        </Button>
        {mobileOpen && (
          <div className="border-line mt-3 overflow-hidden rounded-2xl border bg-neutral-950 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[11px] text-white/60">
              <span>LIVE PREVIEW</span>
              <span>{selectedTemplate?.name ?? "Belum pilih template"}</span>
            </div>
            <div className="h-[70svh]">{preview}</div>
          </div>
        )}
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-6">
          <div className="mb-2 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-medium text-ink">
              <Eye className="size-3.5" /> Live Preview
            </div>
            <span className="text-[10px] tracking-wide text-ink-soft uppercase">{selectedTemplate?.name ?? "Template"}</span>
          </div>
          <div className={cn("border-line overflow-hidden rounded-[1.75rem] border-8 bg-neutral-950 shadow-2xl", "h-[calc(100vh-7rem)] min-h-[620px]")}>{preview}</div>
          <p className="mt-2 px-1 text-[10px] leading-4 text-ink-soft">Preview menggunakan renderer template asli. Musik dan aksi RSVP dinonaktifkan di editor.</p>
        </div>
      </aside>
    </>
  );
}
