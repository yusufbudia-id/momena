"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitRsvp } from "@/features/rsvp/actions";
import { rsvpFormSchema, type RsvpFormValues } from "@/features/rsvp/validation";

import type { SectionProps } from "../../../../types";
import type { AttendanceStatus } from "../../../../view-model";

const options: { value: AttendanceStatus; label: string }[] = [
  { value: "ATTENDING", label: "Hadir" },
  { value: "NOT_ATTENDING", label: "Tidak hadir" },
  { value: "MAYBE", label: "Belum pasti" },
];

const statusLabel: Record<AttendanceStatus, string> = {
  ATTENDING: "Hadir",
  NOT_ATTENDING: "Tidak hadir",
  MAYBE: "Belum pasti",
};

const statusTone: Record<AttendanceStatus, "success" | "neutral" | "warning"> = {
  ATTENDING: "success",
  NOT_ATTENDING: "neutral",
  MAYBE: "warning",
};

export function Rsvp({ invitation, guestName }: SectionProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      guestName: guestName ?? "",
      phone: "",
      attendeeCount: 1,
      status: "ATTENDING",
      message: "",
    },
  });

  const selected = watch("status");

  function onSubmit(data: RsvpFormValues) {
    if (invitation.isPreview) {
      toast.info("Ini halaman preview — RSVP tidak benar-benar dikirim.");
      reset();
      return;
    }
    startTransition(async () => {
      const result = await submitRsvp(invitation.id, invitation.slug, data);
      if (result.success) {
        toast.success("Konfirmasi berhasil dikirim.");
        reset();
        router.refresh();
      } else toast.error(result.error);
    });
  }

  return (
    <section id="rsvp" className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[720px]">
        <div className="grid gap-6 border-b border-[var(--minimal-line)] pb-6 sm:grid-cols-[1fr_.8fr] sm:items-end">
          <div>
            <p className="text-[9px] tracking-[0.34em] text-[var(--minimal-accent)] uppercase">06 · RSVP</p>
            <h2 className="font-display mt-3 text-4xl tracking-[-0.04em] text-[var(--minimal-ink)] italic sm:text-5xl">Will you be there?</h2>
          </div>
          <p className="text-sm leading-6 text-[var(--minimal-muted)] sm:text-right">
            Konfirmasi singkat Anda membantu kami mempersiapkan hari ini dengan lebih baik.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field label="Nama">
            <Input className="h-12 rounded-none border-x-0 border-t-0 bg-transparent px-0 shadow-none focus-visible:ring-0" placeholder="Nama lengkap" {...register("guestName")} />
            <FieldError message={errors.guestName?.message} />
          </Field>
          <Field label="WhatsApp (opsional)">
            <Input className="h-12 rounded-none border-x-0 border-t-0 bg-transparent px-0 shadow-none focus-visible:ring-0" placeholder="08…" {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </Field>
          <Field label="Jumlah tamu">
            <Input className="h-12 rounded-none border-x-0 border-t-0 bg-transparent px-0 shadow-none focus-visible:ring-0" type="number" min={1} max={20} {...register("attendeeCount")} />
            <FieldError message={errors.attendeeCount?.message} />
          </Field>
          <div>
            <Label className="text-[10px] tracking-[0.18em] text-[var(--minimal-muted)] uppercase">Kehadiran</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {options.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer border px-3 py-2 text-xs transition ${selected === option.value ? "border-[var(--minimal-ink)] bg-[var(--minimal-ink)] text-white" : "border-[var(--minimal-line)] text-[var(--minimal-muted)] hover:border-[var(--minimal-line-strong)]"}`}
                >
                  <input className="sr-only" type="radio" value={option.value} {...register("status")} />
                  {option.label}
                </label>
              ))}
            </div>
            <FieldError message={errors.status?.message} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="message" className="text-[10px] tracking-[0.18em] text-[var(--minimal-muted)] uppercase">Ucapan</Label>
            <Textarea id="message" rows={4} className="mt-2 rounded-none border-x-0 border-t-0 bg-transparent px-0 shadow-none focus-visible:ring-0" placeholder="Tulis doa dan ucapan…" {...register("message")} />
            <FieldError message={errors.message?.message} />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending} className="h-12 rounded-none bg-[var(--minimal-ink)] px-8 text-[10px] tracking-[0.24em] uppercase hover:bg-[var(--minimal-accent)]">
              {pending ? "Mengirim…" : "Kirim Konfirmasi"}
            </Button>
          </div>
        </form>

        {invitation.guestBook.length > 0 && (
          <div className="mt-14 border-t border-[var(--minimal-line)] pt-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[10px] tracking-[0.24em] text-[var(--minimal-muted)] uppercase">Guest Notes</h3>
              <span className="text-xs text-[var(--minimal-muted)]">{invitation.guestBook.length} ucapan</span>
            </div>
            <div className="mt-4 divide-y divide-[var(--minimal-line)]">
              {invitation.guestBook.map((entry) => (
                <div key={entry.id} className="py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[var(--minimal-ink)]">{entry.guestName}</p>
                    <Badge variant={statusTone[entry.status]}>{statusLabel[entry.status]}</Badge>
                  </div>
                  {entry.message && <p className="mt-2 text-sm leading-6 text-[var(--minimal-muted)]">{entry.message}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label className="text-[10px] tracking-[0.18em] text-[var(--minimal-muted)] uppercase">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
