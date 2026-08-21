"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/ui/field-error";
import { submitRsvp } from "@/features/rsvp/actions";
import { rsvpFormSchema, type RsvpFormValues } from "@/features/rsvp/validation";
import type { SectionProps } from "../../../../types";
import type { AttendanceStatus } from "../../../../view-model";

const options: { value: AttendanceStatus; label: string }[] = [
  { value: "ATTENDING", label: "I’m in" },
  { value: "NOT_ATTENDING", label: "Can’t make it" },
  { value: "MAYBE", label: "Maybe" },
];

export function Rsvp({ invitation, guestName }: SectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: { guestName: guestName ?? "", phone: "", attendeeCount: 1, status: "ATTENDING", message: "" },
  });
  const selected = watch("status");

  function onSubmit(data: RsvpFormValues) {
    if (invitation.isPreview) { toast.info("Ini halaman preview — RSVP tidak benar-benar dikirim."); reset(); return; }
    startTransition(async () => {
      const result = await submitRsvp(invitation.id, invitation.slug, data);
      if (result.success) { toast.success("Konfirmasi sudah terkirim."); reset(); router.refresh(); }
      else toast.error(result.error);
    });
  }

  return (
    <section id="rsvp" className="bg-[#0d1017] px-5 py-20 text-white sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="text-[10px] tracking-[.35em] uppercase text-[#ff6ca8]">RSVP</p>
          <h2 className="mt-3 text-5xl font-black uppercase leading-[.84] tracking-[-.06em] sm:text-7xl">Are you<br/>coming?</h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/48">Konfirmasi kehadiranmu dan tinggalkan pesan untuk kami. Simple, quick, done.</p>
          {invitation.guestBook.length > 0 && (
            <div className="mt-10 flex gap-5 border-t border-white/12 pt-5">
              <div><span className="block text-2xl font-black">{invitation.guestBook.filter(e=>e.status==="ATTENDING").length}</span><span className="text-[9px] tracking-[.2em] uppercase text-white/40">Hadir</span></div>
              <div><span className="block text-2xl font-black">{invitation.guestBook.length}</span><span className="text-[9px] tracking-[.2em] uppercase text-white/40">Responses</span></div>
            </div>
          )}
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama" error={errors.guestName?.message}><input {...register("guestName")} placeholder="Nama lengkap" className="modern-input" /></Field>
            <Field label="WhatsApp" error={errors.phone?.message}><input {...register("phone")} placeholder="08…" className="modern-input" /></Field>
            <Field label="Jumlah tamu" error={errors.attendeeCount?.message}><input type="number" min={1} max={20} {...register("attendeeCount")} className="modern-input" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-2 text-[10px] font-semibold tracking-[.22em] uppercase text-white/45">Kehadiran</p>
              <div className="grid grid-cols-3 gap-2">
                {options.map(option => <label key={option.value} className={`cursor-pointer border px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[.14em] transition ${selected===option.value?"border-[var(--modern-violet)] bg-[var(--modern-violet)] text-white":"border-white/12 text-white/55 hover:border-white/30"}`}><input type="radio" value={option.value} className="sr-only" {...register("status")}/>{option.label}</label>)}
              </div>
              <FieldError message={errors.status?.message}/>
            </div>
            <Field label="Ucapan" error={errors.message?.message} className="sm:col-span-2"><textarea rows={4} {...register("message")} placeholder="Tulis pesan untuk mempelai…" className="modern-input resize-none py-3" /></Field>
            <button type="submit" disabled={isPending} className="sm:col-span-2 h-12 bg-[#ff5f9f] px-5 text-[11px] font-black tracking-[.24em] uppercase text-[#101218] transition hover:bg-[#b7a4ff] disabled:opacity-50">{isPending?"Sending…":"Send RSVP"}</button>
          </form>

          {invitation.guestBook.length > 0 && <div className="mt-10 border-t border-white/12 pt-5"><p className="mb-4 text-[10px] tracking-[.28em] uppercase text-white/35">Latest notes</p><div className="grid gap-3">{invitation.guestBook.slice().reverse().slice(0,4).map(entry=><div key={entry.id} className="border border-white/10 p-4"><div className="flex items-center justify-between gap-4"><p className="text-sm font-bold uppercase tracking-tight">{entry.guestName}</p><span className="text-[9px] tracking-[.18em] uppercase text-[#b7a4ff]">{entry.status==="ATTENDING"?"Hadir":entry.status==="MAYBE"?"Maybe":"Tidak hadir"}</span></div>{entry.message&&<p className="mt-2 text-sm leading-6 text-white/45">{entry.message}</p>}</div>)}</div></div>}
        </div>
      </div>
      <style>{`.modern-input{width:100%;height:48px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.035);padding:0 14px;color:white;outline:none;font-size:14px}.modern-input::placeholder{color:rgba(255,255,255,.25)}.modern-input:focus{border-color:var(--modern-violet)}`}</style>
    </section>
  );
}

function Field({label,error,children,className=""}:{label:string;error?:string;children:ReactNode;className?:string}){return <div className={className}><p className="mb-2 text-[10px] font-semibold tracking-[.22em] uppercase text-white/45">{label}</p>{children}<FieldError message={error}/></div>}
