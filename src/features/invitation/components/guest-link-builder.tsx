"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GuestLinkBuilder({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const base = `${window.location.origin}/i/${slug}`;
    const url = name.trim() ? `${base}?to=${encodeURIComponent(name.trim())}` : base;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="border-line bg-surface mb-5 rounded-xl border p-4">
      <p className="text-sm font-medium text-ink">Link personal tamu</p>
      <p className="mt-1 text-xs text-ink-soft">Nama akan tampil pada undangan melalui parameter <code>?to=</code>.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama tamu / keluarga" />
        <Button type="button" variant="outline" onClick={() => void copyLink()}><span>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</span>{copied ? "Tersalin" : "Salin Link"}</Button>
      </div>
    </div>
  );
}
