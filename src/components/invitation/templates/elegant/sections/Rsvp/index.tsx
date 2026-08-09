"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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

const attendanceOptions: { value: AttendanceStatus; label: string }[] = [
  { value: "ATTENDING", label: "Hadir" },
  { value: "NOT_ATTENDING", label: "Tidak Hadir" },
  { value: "MAYBE", label: "Masih Ragu" },
];

const statusLabel: Record<AttendanceStatus, string> = {
  ATTENDING: "Hadir",
  NOT_ATTENDING: "Tidak Hadir",
  MAYBE: "Masih Ragu",
};

const statusTone: Record<AttendanceStatus, "success" | "neutral" | "warning"> = {
  ATTENDING: "success",
  NOT_ATTENDING: "neutral",
  MAYBE: "warning",
};

export function Rsvp({ invitation, guestName }: SectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
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

  function onSubmit(data: RsvpFormValues) {
    if (invitation.isPreview) {
      toast.info("ℹ️ Ini halaman preview — RSVP tidak benar-benar dikirim.");
      reset();
      return;
    }

    startTransition(async () => {
      const result = await submitRsvp(invitation.id, invitation.slug, data);
      if (result.success) {
        toast.success("Terima kasih! Konfirmasi kamu sudah terkirim.");
        reset();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  const name = invitation.couple?.first ?? invitation.title.split(" ")[0];

  return (
    <section id="rsvp" className="px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <h2 className="font-display text-ink text-2xl italic">Konfirmasi Kehadiran</h2>
        <p className="text-ink-soft mt-2 text-sm">
          Mohon konfirmasi kehadiran Anda untuk membantu {name} mempersiapkan acara dengan
          baik.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-8 flex max-w-md flex-col gap-4 text-left"
      >
        <div>
          <Label htmlFor="guestName">Nama</Label>
          <Input id="guestName" placeholder="Nama lengkap" {...register("guestName")} />
          <FieldError message={errors.guestName?.message} />
        </div>

        <div>
          <Label htmlFor="phone">Nomor WhatsApp (opsional)</Label>
          <Input id="phone" placeholder="08…" {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <Label htmlFor="attendeeCount">Jumlah Tamu</Label>
          <Input
            id="attendeeCount"
            type="number"
            min={1}
            max={20}
            {...register("attendeeCount")}
          />
          <FieldError message={errors.attendeeCount?.message} />
        </div>

        <div>
          <Label>Kehadiran</Label>
          <div className="flex flex-col gap-1">
            {attendanceOptions.map((option) => (
              <label
                key={option.value}
                className="border-line hover:bg-paper flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 text-sm"
              >
                <input
                  type="radio"
                  value={option.value}
                  className="accent-accent size-4"
                  {...register("status")}
                />
                {option.label}
              </label>
            ))}
          </div>
          <FieldError message={errors.status?.message} />
        </div>

        <div>
          <Label htmlFor="message">Ucapan</Label>
          <Textarea
            id="message"
            rows={3}
            placeholder="Tulis ucapan dan doa untuk mempelai…"
            {...register("message")}
          />
          <FieldError message={errors.message?.message} />
        </div>

        <Button type="submit" variant="accent" disabled={isPending} className="h-11">
          {isPending ? "Mengirim…" : "Kirim"}
        </Button>
      </form>

      {invitation.guestBook.length > 0 && (
        <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
          <h3 className="text-ink-soft text-sm font-medium">
            {invitation.guestBook.length} ucapan & konfirmasi
          </h3>
          {invitation.guestBook.map((entry) => (
            <div
              key={entry.id}
              className="border-line bg-surface rounded-xl border p-4 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink font-medium">{entry.guestName}</span>
                <Badge variant={statusTone[entry.status]}>
                  {statusLabel[entry.status]}
                </Badge>
              </div>
              {entry.message && (
                <p className="text-ink-soft mt-1.5 text-sm">{entry.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
