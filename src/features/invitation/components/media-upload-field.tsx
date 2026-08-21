"use client";

import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadedMedia {
  url: string;
  publicId: string;
}

interface MediaUploadFieldProps {
  label: string;
  value?: string | null;
  publicId?: string | null;
  onChange: (media: UploadedMedia | null) => void;
  helper?: string;
  className?: string;
  aspectClassName?: string;
  positionX?: number;
  positionY?: number;
  onPositionChange?: (x: number, y: number) => void;
}

export function MediaUploadField({
  label,
  value,
  publicId: _publicId,
  onChange,
  helper,
  className,
  aspectClassName = "aspect-[4/5]",
  positionX = 50,
  positionY = 50,
  onPositionChange,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionPublicId, setSessionPublicId] = useState<string | null>(null);
  const isAdjustingFocusRef = useRef(false);

  function updateFocusFromPointer(element: HTMLElement, clientX: number, clientY: number) {
    if (!onPositionChange) return;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)));
    onPositionChange(x, y);
  }

  async function deleteSessionUpload(id: string | null) {
    if (!id) return;
    try {
      await fetch("/api/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: id }),
      });
    } catch {
      // Cleanup best-effort; penyimpanan form tetap boleh lanjut.
    }
  }

  function upload(file: File) {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error("Format foto harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 10 MB.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    setIsUploading(true);
    setProgress(0);

    xhr.open("POST", "/api/media/upload");
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      setProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      setIsUploading(false);
      setProgress(null);
      xhrRef.current = null;

      try {
        const data = JSON.parse(xhr.responseText) as {
          success?: boolean;
          url?: string;
          publicId?: string;
          error?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && data.url && data.publicId) {
          void deleteSessionUpload(sessionPublicId);
          setSessionPublicId(data.publicId);
          onChange({ url: data.url, publicId: data.publicId });
          toast.success(`${label} berhasil diupload`);
          return;
        }
        toast.error(data.error || "Upload foto gagal.");
      } catch {
        toast.error("Upload foto gagal.");
      }
    };
    xhr.onerror = () => {
      setIsUploading(false);
      setProgress(null);
      xhrRef.current = null;
      toast.error("Upload foto gagal. Periksa koneksi.");
    };
    xhr.send(form);
  }

  function handleRemove() {
    if (isUploading) {
      xhrRef.current?.abort();
      setIsUploading(false);
      setProgress(null);
      return;
    }
    void deleteSessionUpload(sessionPublicId);
    setSessionPublicId(null);
    onChange(null);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">{label}</p>
        {value && (
          <Button type="button" size="sm" variant="ghost" onClick={handleRemove}>
            <Trash2 className="size-3.5 text-red-600" /> Hapus
          </Button>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "group relative w-full overflow-hidden rounded-xl border border-dashed border-line bg-paper text-left transition hover:border-accent disabled:cursor-wait",
          aspectClassName,
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- preview file upload dinamis */}
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: `${positionX}% ${positionY}%` }}
            />
            {onPositionChange && (
              <div
                className="absolute inset-0 cursor-crosshair touch-none"
                title="Klik atau geser untuk mengatur titik fokus"
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  isAdjustingFocusRef.current = true;
                  updateFocusFromPointer(event.currentTarget, event.clientX, event.clientY);
                }}
                onPointerMove={(event) => {
                  if (!isAdjustingFocusRef.current) return;
                  updateFocusFromPointer(event.currentTarget, event.clientX, event.clientY);
                }}
                onPointerUp={(event) => {
                  event.stopPropagation();
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                  isAdjustingFocusRef.current = false;
                }}
                onPointerCancel={() => { isAdjustingFocusRef.current = false; }}
              >
                <span
                  className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/30 shadow-[0_0_0_1px_rgba(0,0,0,.45)]"
                  style={{ left: `${positionX}%`, top: `${positionY}%` }}
                >
                  <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </span>
                <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white opacity-90">
                  Geser titik fokus
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full min-h-44 flex-col items-center justify-center gap-2 p-6 text-center text-ink-soft">
            <ImagePlus className="size-7" />
            <span className="text-sm font-medium text-ink">Pilih foto</span>
            <span className="text-xs">JPG, PNG, WebP · maks. 10 MB</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/65 text-white backdrop-blur-sm">
            <Loader2 className="size-6 animate-spin" />
            <p className="text-sm">Mengupload {progress ?? 0}%</p>
            <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full bg-white transition-[width]"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
          </div>
        )}

      </button>

      {value && !isUploading && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="size-3.5" /> Ganti foto
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          event.target.value = "";
        }}
      />
      {value && onPositionChange && (
        <div className="space-y-3 rounded-xl border border-line bg-paper/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-ink">Titik fokus foto</p>
              <p className="mt-0.5 text-[11px] text-ink-soft/70">Klik/geser langsung pada foto atau gunakan slider di bawah.</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onPositionChange(50, 50)}
              disabled={positionX === 50 && positionY === 50}
            >
              Reset
            </Button>
          </div>

          <label className="grid grid-cols-[68px_1fr_34px] items-center gap-2 text-[11px] text-ink-soft">
            Horizontal
            <input
              type="range"
              min={0}
              max={100}
              value={positionX}
              onChange={(event) => onPositionChange(Number(event.target.value), positionY)}
              className="w-full accent-current"
            />
            <span className="text-right tabular-nums">{positionX}</span>
          </label>
          <label className="grid grid-cols-[68px_1fr_34px] items-center gap-2 text-[11px] text-ink-soft">
            Vertikal
            <input
              type="range"
              min={0}
              max={100}
              value={positionY}
              onChange={(event) => onPositionChange(positionX, Number(event.target.value))}
              className="w-full accent-current"
            />
            <span className="text-right tabular-nums">{positionY}</span>
          </label>
        </div>
      )}
      {helper && <p className="text-xs text-ink-soft/70">{helper}</p>}
    </div>
  );
}
