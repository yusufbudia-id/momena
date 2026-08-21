"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Check, Heart, Plus, Trash2, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/types/action-result";
import { slugify } from "@/utils/slugify";

import { publishInvitation } from "../actions";
import type { Invitation } from "../types";
import {
  invitationWizardFormSchema,
  type InvitationWizardFormValues,
} from "../validation";

import { GalleryUploadPanel } from "./gallery-upload-panel";
import { MediaUploadField } from "./media-upload-field";
import { PublishResultDialog } from "./publish-result-dialog";

const STEPS = ["Event", "Template", "Gallery", "Story", "Gift", "Publish"] as const;

const STEP_FIELDS: Record<number, (keyof InvitationWizardFormValues)[]> = {
  0: [
    "title",
    "slug",
    "groomName",
    "brideName",
    "groomParents",
    "brideParents",
    "groomInstagram",
    "brideInstagram",
    "eventDate",
    "eventLocation",
    "eventAddress",
    "eventMapsUrl",
    "description",
    "coverImageUrl",
    "coverImagePublicId",
    "coverImagePositionX",
    "coverImagePositionY",
    "groomPhotoUrl",
    "groomPhotoPublicId",
    "groomPhotoPositionX",
    "groomPhotoPositionY",
    "bridePhotoUrl",
    "bridePhotoPublicId",
    "bridePhotoPositionX",
    "bridePhotoPositionY",
    "quote",
    "videoUrl",
  ],
  1: ["templateId"],
  2: ["gallery"],
  3: ["stories"],
  4: ["gifts"],
  5: [],
};

interface TemplateOption {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string;
  premium?: boolean;
  description?: string;
}

interface InvitationWizardProps {
  mode: "create" | "edit";
  defaultValues?: Partial<InvitationWizardFormValues>;
  templates: TemplateOption[];
  /** Server Action yang sudah di-bind ke userId (create) atau id (edit). */
  onSubmit: (data: InvitationWizardFormValues) => Promise<ActionResult<Invitation>>;
}

export function InvitationWizard({
  mode,
  defaultValues,
  templates,
  onSubmit,
}: InvitationWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<InvitationWizardFormValues>({
    resolver: zodResolver(invitationWizardFormSchema),
    defaultValues: {
      templateId: "",
      slug: "",
      title: "",
      groomName: "",
      brideName: "",
      groomParents: "",
      brideParents: "",
      groomInstagram: "",
      brideInstagram: "",
      eventDate: "",
      eventLocation: "",
      eventAddress: "",
      eventMapsUrl: "",
      description: "",
      coverImageUrl: "",
      coverImagePublicId: "",
      coverImagePositionX: 50,
      coverImagePositionY: 50,
      groomPhotoUrl: "",
      groomPhotoPublicId: "",
      groomPhotoPositionX: 50,
      groomPhotoPositionY: 50,
      bridePhotoUrl: "",
      bridePhotoPublicId: "",
      bridePhotoPositionX: 50,
      bridePhotoPositionY: 50,
      quote: "",
      videoUrl: "",
      gallery: [],
      stories: [],
      gifts: [],
      ...defaultValues,
    },
  });

  const galleryArray = useFieldArray({ control, name: "gallery" });
  const storyArray = useFieldArray({ control, name: "stories" });
  const giftArray = useFieldArray({ control, name: "gifts" });

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function formatError(result: {
    error: string;
    fieldErrors?: Record<string, string[]>;
  }) {
    const details = result.fieldErrors
      ? Object.entries(result.fieldErrors)
          .filter(([, msgs]) => msgs && msgs.length > 0)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
      : [];
    return details.length > 0 ? `${result.error} — ${details.join(" · ")}` : result.error;
  }

  async function submitAs(action: "draft" | "publish", data: InvitationWizardFormValues) {
    setServerError(null);
    setIsSubmitting(true);

    const result = await onSubmit(data);

    if (!result.success) {
      const message = formatError(result);
      setServerError(message);
      toast.error(message);
      setIsSubmitting(false);
      return;
    }

    if (action === "draft") {
      toast.success("Invitation disimpan sebagai draft");
      router.push("/invitations");
      return;
    }

    const publishResult = await publishInvitation(result.data.id);
    setIsSubmitting(false);

    if (!publishResult.success) {
      const message = formatError(publishResult);
      setServerError(message);
      toast.error(message);
      return;
    }

    toast.success("Invitation berhasil dipublish");
    setPublishedSlug(publishResult.data.slug);
  }

  return (
    <div>
      <WizardSteps current={step} />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="border-line bg-surface mt-6 rounded-xl border p-6"
      >
        {step === 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Nama Acara</Label>
              <Input
                id="title"
                placeholder="Pernikahan Andi & Siti"
                {...register("title", {
                  onChange: (e) => {
                    if (mode === "create" && !touchedFields.slug) {
                      setValue("slug", slugify(e.target.value));
                    }
                  },
                })}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="slug">Slug (URL undangan)</Label>
              <div className="flex items-center gap-2">
                <span className="text-ink-soft text-sm">/i/</span>
                <Input id="slug" placeholder="andi-siti" {...register("slug")} />
              </div>
              <FieldError message={errors.slug?.message} />
            </div>

            <div>
              <Label htmlFor="groomName">Nama Mempelai Pria</Label>
              <Input id="groomName" placeholder="Andi" {...register("groomName")} />
              <FieldError message={errors.groomName?.message} />
            </div>

            <div>
              <Label htmlFor="brideName">Nama Mempelai Wanita</Label>
              <Input id="brideName" placeholder="Siti" {...register("brideName")} />
              <FieldError message={errors.brideName?.message} />
              <p className="text-ink-soft/70 mt-1 text-xs">
                Opsional — kosongkan kalau acaranya bukan pernikahan.
              </p>
            </div>

            <div>
              <Label htmlFor="groomParents">Orang Tua Mempelai Pria</Label>
              <Input
                id="groomParents"
                placeholder="Putra dari Bapak Suryanto & Ibu Wati"
                {...register("groomParents")}
              />
              <FieldError message={errors.groomParents?.message} />
            </div>

            <div>
              <Label htmlFor="brideParents">Orang Tua Mempelai Wanita</Label>
              <Input
                id="brideParents"
                placeholder="Putri dari Bapak Hartono & Ibu Rahayu"
                {...register("brideParents")}
              />
              <FieldError message={errors.brideParents?.message} />
            </div>

            <div>
              <Label htmlFor="groomInstagram">Instagram Mempelai Pria</Label>
              <div className="flex items-center gap-2">
                <span className="text-ink-soft text-sm">@</span>
                <Input
                  id="groomInstagram"
                  placeholder="andi.wijaya"
                  {...register("groomInstagram")}
                />
              </div>
              <FieldError message={errors.groomInstagram?.message} />
            </div>

            <div>
              <Label htmlFor="brideInstagram">Instagram Mempelai Wanita</Label>
              <div className="flex items-center gap-2">
                <span className="text-ink-soft text-sm">@</span>
                <Input
                  id="brideInstagram"
                  placeholder="siti.rahma"
                  {...register("brideInstagram")}
                />
              </div>
              <FieldError message={errors.brideInstagram?.message} />
            </div>

            <div>
              <Label htmlFor="eventDate">Tanggal Acara</Label>
              <Input id="eventDate" type="date" {...register("eventDate")} />
              <FieldError message={errors.eventDate?.message} />
            </div>

            <div>
              <Label htmlFor="eventLocation">Nama Lokasi</Label>
              <Input
                id="eventLocation"
                placeholder="Gedung Serba Guna ABC"
                {...register("eventLocation")}
              />
              <FieldError message={errors.eventLocation?.message} />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="eventAddress">Alamat Lengkap</Label>
              <Input id="eventAddress" {...register("eventAddress")} />
              <FieldError message={errors.eventAddress?.message} />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="eventMapsUrl">Link Google Maps</Label>
              <Input
                id="eventMapsUrl"
                placeholder="https://maps.google.com/…"
                {...register("eventMapsUrl")}
              />
              <FieldError message={errors.eventMapsUrl?.message} />
            </div>

            <div className="sm:col-span-2">
              <div className="mb-3">
                <p className="text-sm font-medium text-ink">Foto Undangan</p>
                <p className="mt-1 text-xs text-ink-soft">
                  Upload foto langsung. Cover disarankan 3:4/4:5, foto mempelai 4:5.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <MediaUploadField
                  label="Foto Cover"
                  value={watch("coverImageUrl")}
                  publicId={watch("coverImagePublicId")}
                  positionX={watch("coverImagePositionX")}
                  positionY={watch("coverImagePositionY")}
                  onPositionChange={(x, y) => {
                    setValue("coverImagePositionX", x, { shouldDirty: true });
                    setValue("coverImagePositionY", y, { shouldDirty: true });
                  }}
                  onChange={(media) => {
                    setValue("coverImageUrl", media?.url ?? "", { shouldValidate: true });
                    setValue("coverImagePublicId", media?.publicId ?? "");
                    if (media) {
                      setValue("coverImagePositionX", 50);
                      setValue("coverImagePositionY", 50);
                    }
                  }}
                  helper="Dipakai pada opening dan hero."
                />
                <MediaUploadField
                  label="Foto Mempelai Pria"
                  value={watch("groomPhotoUrl")}
                  publicId={watch("groomPhotoPublicId")}
                  positionX={watch("groomPhotoPositionX")}
                  positionY={watch("groomPhotoPositionY")}
                  onPositionChange={(x, y) => {
                    setValue("groomPhotoPositionX", x, { shouldDirty: true });
                    setValue("groomPhotoPositionY", y, { shouldDirty: true });
                  }}
                  onChange={(media) => {
                    setValue("groomPhotoUrl", media?.url ?? "", { shouldValidate: true });
                    setValue("groomPhotoPublicId", media?.publicId ?? "");
                    if (media) {
                      setValue("groomPhotoPositionX", 50);
                      setValue("groomPhotoPositionY", 50);
                    }
                  }}
                  helper="Foto portrait khusus Groom."
                />
                <MediaUploadField
                  label="Foto Mempelai Wanita"
                  value={watch("bridePhotoUrl")}
                  publicId={watch("bridePhotoPublicId")}
                  positionX={watch("bridePhotoPositionX")}
                  positionY={watch("bridePhotoPositionY")}
                  onPositionChange={(x, y) => {
                    setValue("bridePhotoPositionX", x, { shouldDirty: true });
                    setValue("bridePhotoPositionY", y, { shouldDirty: true });
                  }}
                  onChange={(media) => {
                    setValue("bridePhotoUrl", media?.url ?? "", { shouldValidate: true });
                    setValue("bridePhotoPublicId", media?.publicId ?? "");
                    if (media) {
                      setValue("bridePhotoPositionX", 50);
                      setValue("bridePhotoPositionY", 50);
                    }
                  }}
                  helper="Foto portrait khusus Bride."
                />
              </div>
              <input type="hidden" {...register("coverImageUrl")} />
              <input type="hidden" {...register("coverImagePublicId")} />
              <input type="hidden" {...register("coverImagePositionX", { valueAsNumber: true })} />
              <input type="hidden" {...register("coverImagePositionY", { valueAsNumber: true })} />
              <input type="hidden" {...register("groomPhotoUrl")} />
              <input type="hidden" {...register("groomPhotoPublicId")} />
              <input type="hidden" {...register("groomPhotoPositionX", { valueAsNumber: true })} />
              <input type="hidden" {...register("groomPhotoPositionY", { valueAsNumber: true })} />
              <input type="hidden" {...register("bridePhotoUrl")} />
              <input type="hidden" {...register("bridePhotoPublicId")} />
              <input type="hidden" {...register("bridePhotoPositionX", { valueAsNumber: true })} />
              <input type="hidden" {...register("bridePhotoPositionY", { valueAsNumber: true })} />
              <FieldError message={errors.coverImageUrl?.message} />
              <FieldError message={errors.groomPhotoUrl?.message} />
              <FieldError message={errors.bridePhotoUrl?.message} />
            </div>

            <div>
              <Label htmlFor="videoUrl">Link Video (YouTube/Vimeo)</Label>
              <Input
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=…"
                {...register("videoUrl")}
              />
              <FieldError message={errors.videoUrl?.message} />
            </div>

            <div>
              <Label htmlFor="quote">Kutipan / Ayat</Label>
              <Input
                id="quote"
                placeholder="“Dan di antara tanda-tanda kekuasaan-Nya...”"
                {...register("quote")}
              />
              <FieldError message={errors.quote?.message} />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="description">Deskripsi / Kata Sambutan</Label>
              <Textarea id="description" rows={4} {...register("description")} />
              <FieldError message={errors.description?.message} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-ink-soft mb-4 text-sm">
              Pilih template untuk undangan ini.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {templates.map((template) => {
                const selected = watch("templateId") === template.id;
                return (
                  <button
                    type="button"
                    key={template.id}
                    onClick={() =>
                      setValue("templateId", template.id, { shouldValidate: true })
                    }
                    className={cn(
                      "overflow-hidden rounded-lg border-2 text-left transition-colors",
                      selected ? "border-accent" : "border-line hover:border-ink-soft/40",
                    )}
                  >
                    <div className="bg-paper text-ink-soft/50 relative flex aspect-[3/4] items-center justify-center">
                      {/* thumbnailUrl asli menunggu aset template */}
                      <span className="text-xs">{template.name}</span>
                      {template.premium && (
                        <span className="bg-accent absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-medium text-white">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{template.name}</span>
                        {selected && <Check className="text-accent size-4" />}
                      </div>
                      {template.description && (
                        <p className="text-ink-soft mt-0.5 line-clamp-2 text-xs">
                          {template.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.templateId?.message} />
          </div>
        )}

        {step === 2 && (
          <GalleryUploadPanel
            items={watch("gallery") ?? []}
            onAppend={(item) => galleryArray.append(item)}
            onRemove={(index) => galleryArray.remove(index)}
            onMove={(from, to) => galleryArray.move(from, to)}
            onCaptionChange={(index, caption) =>
              setValue(`gallery.${index}.caption`, caption, { shouldDirty: true })
            }
          />
        )}

        {step === 3 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-ink-soft text-sm">
                Tambahkan momen-momen kisah cinta kalian (opsional).
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  storyArray.append({ title: "", date: "", description: "" })
                }
              >
                <Plus className="size-3.5" /> Tambah Momen
              </Button>
            </div>

            {storyArray.fields.length === 0 && (
              <div className="border-line text-ink-soft flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm">
                <Heart className="size-6" />
                Belum ada momen ditambahkan.
              </div>
            )}

            <div className="flex flex-col gap-3">
              {storyArray.fields.map((field, index) => (
                <div key={field.id} className="border-line rounded-lg border p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Judul momen, mis. Pertama Bertemu"
                        {...register(`stories.${index}.title`)}
                      />
                      <FieldError message={errors.stories?.[index]?.title?.message} />
                      <Input
                        placeholder="Kapan (opsional), mis. Januari 2020"
                        {...register(`stories.${index}.date`)}
                      />
                      <Textarea
                        placeholder="Ceritakan momennya…"
                        rows={2}
                        {...register(`stories.${index}.description`)}
                      />
                      <FieldError
                        message={errors.stories?.[index]?.description?.message}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => storyArray.remove(index)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-ink-soft text-sm">
                Tambahkan rekening/e-wallet untuk amplop digital.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  giftArray.append({
                    method: "BANK_TRANSFER",
                    bankName: "",
                    accountNumber: "",
                    accountHolder: "",
                    note: "",
                  })
                }
              >
                <Plus className="size-3.5" /> Tambah Metode
              </Button>
            </div>

            {giftArray.fields.length === 0 && (
              <div className="border-line text-ink-soft flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm">
                <Wallet className="size-6" />
                Belum ada metode gift ditambahkan.
              </div>
            )}

            <div className="flex flex-col gap-3">
              {giftArray.fields.map((field, index) => {
                const method = watch(`gifts.${index}.method`);
                return (
                  <div key={field.id} className="border-line rounded-lg border p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setValue(`gifts.${index}.method`, "BANK_TRANSFER", {
                              shouldValidate: true,
                            })
                          }
                          className={cn(
                            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
                            method === "BANK_TRANSFER"
                              ? "border-accent bg-accent-soft text-accent-ink"
                              : "border-line text-ink-soft",
                          )}
                        >
                          <Banknote className="size-3.5" /> Transfer Bank
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setValue(`gifts.${index}.method`, "E_WALLET", {
                              shouldValidate: true,
                            })
                          }
                          className={cn(
                            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
                            method === "E_WALLET"
                              ? "border-accent bg-accent-soft text-accent-ink"
                              : "border-line text-ink-soft",
                          )}
                        >
                          <Wallet className="size-3.5" /> E-Wallet
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => giftArray.remove(index)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>

                    {method === "BANK_TRANSFER" ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <Input
                          placeholder="Nama Bank"
                          {...register(`gifts.${index}.bankName`)}
                        />
                        <Input
                          placeholder="Nomor Rekening"
                          {...register(`gifts.${index}.accountNumber`)}
                        />
                        <Input
                          placeholder="Atas Nama"
                          {...register(`gifts.${index}.accountHolder`)}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Input
                          placeholder="Nama E-Wallet (GoPay, OVO, dst)"
                          {...register(`gifts.${index}.ewalletName`)}
                        />
                        <Input
                          placeholder="Nomor E-Wallet"
                          {...register(`gifts.${index}.ewalletNumber`)}
                        />
                      </div>
                    )}
                    <Input
                      className="mt-2"
                      placeholder="Catatan (opsional)"
                      {...register(`gifts.${index}.note`)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="text-ink-soft mb-4 text-sm">
              Cek sekali lagi sebelum disimpan atau dipublish.
            </p>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <SummaryItem label="Nama Acara" value={watch("title")} />
              {(watch("groomName") || watch("brideName")) && (
                <SummaryItem
                  label="Mempelai"
                  value={`${watch("groomName") || "—"} & ${watch("brideName") || "—"}`}
                />
              )}
              <SummaryItem label="Slug" value={`/i/${watch("slug")}`} />
              <SummaryItem
                label="Template"
                value={templates.find((t) => t.id === watch("templateId"))?.name ?? "—"}
              />
              <SummaryItem label="Tanggal" value={watch("eventDate") || "—"} />
              <SummaryItem
                label="Jumlah Foto"
                value={String(galleryArray.fields.length)}
              />
              <SummaryItem
                label="Momen Kisah Cinta"
                value={String(storyArray.fields.length)}
              />
              <SummaryItem label="Metode Gift" value={String(giftArray.fields.length)} />
            </dl>

            {serverError && <p className="mt-4 text-sm text-red-600">{serverError}</p>}
          </div>
        )}

        <div className="border-line mt-6 flex items-center justify-between border-t pt-4">
          <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
            Kembali
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" variant="accent" onClick={goNext}>
              Lanjut
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => submitAs("draft", data))}
              >
                Simpan sebagai Draft
              </Button>
              <Button
                type="button"
                variant="accent"
                disabled={isSubmitting}
                onClick={handleSubmit((data) => submitAs("publish", data))}
              >
                {isSubmitting ? "Memproses…" : "Publish Sekarang"}
              </Button>
            </div>
          )}
        </div>
      </form>

      {publishedSlug && (
        <PublishResultDialog
          open={!!publishedSlug}
          onOpenChange={(open) => {
            if (!open) {
              setPublishedSlug(null);
              router.push("/invitations");
            }
          }}
          slug={publishedSlug}
        />
      )}
    </div>
  );
}

function WizardSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto">
      {STEPS.map((label, index) => (
        <li key={label} className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-medium",
              index === current
                ? "bg-accent text-white"
                : index < current
                  ? "bg-success-soft text-success"
                  : "bg-neutral-status-soft text-neutral-status",
            )}
          >
            {index < current ? <Check className="size-3.5" /> : index + 1}
          </span>
          <span
            className={cn(
              "text-sm",
              index === current ? "text-ink font-medium" : "text-ink-soft",
            )}
          >
            {label}
          </span>
          {index < STEPS.length - 1 && <span className="bg-line mx-1 h-px w-6" />}
        </li>
      ))}
    </ol>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-soft text-xs tracking-wide uppercase">{label}</dt>
      <dd className="text-ink mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
