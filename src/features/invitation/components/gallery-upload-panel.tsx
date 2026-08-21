"use client";

import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GalleryItem {
  imageUrl: string;
  imagePublicId?: string | null;
  caption?: string | null;
}

interface GalleryUploadPanelProps {
  items: GalleryItem[];
  onAppend: (item: GalleryItem) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onCaptionChange: (index: number, caption: string) => void;
}

function uploadOne(file: File, onProgress: (progress: number) => void) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/media/upload");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as {
          url?: string;
          publicId?: string;
          error?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && data.url && data.publicId) {
          resolve({ url: data.url, publicId: data.publicId });
          return;
        }
        reject(new Error(data.error || "Upload foto gagal."));
      } catch {
        reject(new Error("Upload foto gagal."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload foto gagal. Periksa koneksi."));
    xhr.send(form);
  });
}

export function GalleryUploadPanel({
  items,
  onAppend,
  onRemove,
  onMove,
  onCaptionChange,
}: GalleryUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const sessionUploadsRef = useRef(new Set<string>());
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const selected = Array.from(files);
    if (items.length + selected.length > 20) {
      toast.error("Galeri maksimal 20 foto.");
      return;
    }

    for (const file of selected) {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        toast.error(`${file.name}: format harus JPG, PNG, atau WebP.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: ukuran maksimal 10 MB.`);
        return;
      }
    }

    setUploading(true);
    setProgress({ current: 1, total: selected.length, percent: 0 });

    try {
      for (let index = 0; index < selected.length; index += 1) {
        setProgress({ current: index + 1, total: selected.length, percent: 0 });
        const uploaded = await uploadOne(selected[index], (percent) =>
          setProgress({ current: index + 1, total: selected.length, percent }),
        );
        sessionUploadsRef.current.add(uploaded.publicId);
        onAppend({
          imageUrl: uploaded.url,
          imagePublicId: uploaded.publicId,
          caption: "",
        });
      }
      toast.success(`${selected.length} foto berhasil ditambahkan ke galeri`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload galeri gagal.");
    } finally {
      setUploading(false);
      setProgress({ current: 0, total: 0, percent: 0 });
    }
  }


  async function removeItem(index: number) {
    const item = items[index];
    const id = item?.imagePublicId ?? null;
    if (id && sessionUploadsRef.current.has(id)) {
      sessionUploadsRef.current.delete(id);
      try {
        await fetch("/api/media/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: id }),
        });
      } catch {
        // Best-effort cleanup.
      }
    }
    onRemove(index);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">Galeri</p>
          <p className="mt-1 text-xs text-ink-soft">
            Upload beberapa foto sekaligus, lalu atur urutannya.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || items.length >= 20}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
          {uploading ? "Mengupload…" : "Upload Foto"}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {uploading && (
        <div className="mb-4 rounded-lg border border-line bg-paper p-3">
          <div className="flex justify-between text-xs text-ink-soft">
            <span>
              Mengupload {progress.current}/{progress.total}
            </span>
            <span>{progress.percent}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-accent transition-[width]"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-soft transition hover:border-accent hover:text-ink"
        >
          <ImagePlus className="size-7" />
          <span className="font-medium">Belum ada foto</span>
          <span className="text-xs">Klik untuk upload beberapa foto sekaligus</span>
        </button>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={`${item.imageUrl}-${index}`} className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="relative aspect-[4/3] bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element -- preview URL Cloudinary dinamis */}
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                <div className="absolute top-2 left-2 rounded-full bg-black/65 px-2 py-1 text-[10px] text-white">
                  {index + 1}
                </div>
              </div>
              <div className="space-y-3 p-3">
                <Input
                  value={item.caption ?? ""}
                  placeholder="Caption (opsional)"
                  onChange={(event) => onCaptionChange(index, event.target.value)}
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={index === 0}
                      onClick={() => onMove(index, index - 1)}
                      aria-label="Geser foto ke atas"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      disabled={index === items.length - 1}
                      onClick={() => onMove(index, index + 1)}
                      aria-label="Geser foto ke bawah"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                  </div>
                  <Button type="button" size="sm" variant="ghost" onClick={() => void removeItem(index)}>
                    <Trash2 className="size-4 text-red-600" /> Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
