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

const attendanceOptions: { value: AttendanceStatus; label: string; description: string }[] = [
  { value: "ATTENDING", label: "Hadir", description: "Saya akan datang dan merayakan bersama." },
  { value: "NOT_ATTENDING", label: "Tidak Hadir", description: "Saya berhalangan hadir namun tetap mengirim doa terbaik." },
  { value: "MAYBE", label: "Masih Ragu", description: "Saya masih menyesuaikan jadwal dan akan memberi kepastian." },
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

  const selectedStatus = watch("status");

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
  const guestBookEntries = invitation.guestBook.slice().reverse();

  return (
    <section id="rsvp" className="px-0 py-2">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[10px] tracking-[0.5em] text-[var(--color-accent)]/70 uppercase">
          RSVP
        </p>
        <h2 className="font-display mt-3 text-3xl italic text-[var(--color-ink)] sm:text-4xl">
          Konfirmasi Kehadiran
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[15px]">
          Mohon bantu {name} mempersiapkan acara dengan mengisi konfirmasi kehadiran
          serta ucapan terbaik Anda.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-8 flex max-w-xl flex-col gap-5 text-left"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="guestName" className="text-[var(--color-ink-soft)]">
              Nama
            </Label>
            <Input
              id="guestName"
              placeholder="Nama lengkap"
              className="mt-2 h-12 rounded-none border-[var(--color-accent)]/18 bg-[var(--color-surface)]/70"
              {...register("guestName")}
            />
            <FieldError message={errors.guestName?.message} />
          </div>

          <div>
            <Label htmlFor="phone" className="text-[var(--color-ink-soft)]">
              Nomor WhatsApp (opsional)
            </Label>
            <Input
              id="phone"
              placeholder="08…"
              className="mt-2 h-12 rounded-none border-[var(--color-accent)]/18 bg-[var(--color-surface)]/70"
              {...register("phone")}
            />
            <FieldError message={errors.phone?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="attendeeCount" className="text-[var(--color-ink-soft)]">
            Jumlah Tamu
          </Label>
          <Input
            id="attendeeCount"
            type="number"
            min={1}
            max={20}
            className="mt-2 h-12 rounded-none border-[var(--color-accent)]/18 bg-[var(--color-surface)]/70"
            {...register("attendeeCount")}
          />
          <FieldError message={errors.attendeeCount?.message} />
        </div>

        <div>
          <Label className="text-[var(--color-ink-soft)]">Kehadiran</Label>
          <div className="mt-2 flex flex-col gap-3">
            {attendanceOptions.map((option) => {
              const active = selectedStatus === option.value;
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer border px-4 py-4 transition-all ${
                    active
                      ? "border-[var(--color-accent)]/55 bg-[linear-gradient(180deg,rgba(201,162,92,.09),rgba(0,0,0,0))] shadow-[0_10px_28px_rgba(0,0,0,.12)]"
                      : "border-[var(--color-accent)]/16 bg-[var(--color-surface)]/55 hover:border-[var(--color-accent)]/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      value={option.value}
                      className="accent-[var(--color-accent)] mt-1 size-4"
                      {...register("status")}
                    />
                    <div>
                      <p className="text-sm text-[var(--color-ink)]">{option.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--color-ink-soft)]">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          <FieldError message={errors.status?.message} />
        </div>

        <div>
          <Label htmlFor="message" className="text-[var(--color-ink-soft)]">
            Ucapan
          </Label>
          <Textarea
            id="message"
            rows={4}
            placeholder="Tulis ucapan dan doa untuk mempelai…"
            className="mt-2 rounded-none border-[var(--color-accent)]/18 bg-[var(--color-surface)]/70 py-3"
            {...register("message")}
          />
          <FieldError message={errors.message?.message} />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-none border border-[var(--color-accent)]/55 bg-transparent px-6 text-[11px] tracking-[0.28em] text-[var(--color-accent-ink)] uppercase hover:bg-[var(--color-accent)] hover:text-[#080706]"
        >
          {isPending ? "Mengirim…" : "Kirim Konfirmasi"}
        </Button>
      </form>

      {guestBookEntries.length > 0 && (
        <div className="mx-auto mt-12 max-w-xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-sm tracking-[0.25em] text-[var(--color-ink-soft)] uppercase">
              Ucapan & Konfirmasi
            </h3>
            <span className="text-xs text-[var(--color-ink-soft)]">
              {guestBookEntries.length} entri
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {guestBookEntries.map((entry) => (
              <div
                key={entry.id}
                className="border border-[var(--color-accent)]/16 bg-[var(--color-surface)]/62 px-5 py-4 text-left shadow-[inset_0_0_32px_rgba(201,162,92,.015)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-base text-[var(--color-ink)]">{entry.guestName}</p>
                    <p className="mt-1 text-xs tracking-[0.18em] text-[var(--color-ink-soft)] uppercase">
                      {entry.attendeeCount} tamu
                    </p>
                  </div>
                  <Badge variant={statusTone[entry.status]}>
                    {statusLabel[entry.status]}
                  </Badge>
                </div>
                {entry.message && (
                  <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                    {entry.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
