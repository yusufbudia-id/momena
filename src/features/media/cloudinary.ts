import { createHash } from "node:crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary belum dikonfigurasi di environment.");
  }

  return { cloudName, apiKey, apiSecret };
}

function sign(params: Record<string, string | number>, secret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(payload + secret).digest("hex");
}

export function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Format foto harus JPG, PNG, atau WebP.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran foto maksimal 10 MB.");
  }
}

export async function uploadImage(file: File, userId: string) {
  validateImageFile(file);
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `momena/${userId}`;
  const signature = sign({ folder, timestamp }, apiSecret);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });

  const data = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    error?: { message?: string };
  };

  if (!response.ok || !data.secure_url || !data.public_id) {
    throw new Error(data.error?.message || "Upload foto ke Cloudinary gagal.");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width ?? null,
    height: data.height ?? null,
  };
}

export async function deleteImage(publicId: string) {
  if (!publicId) return;

  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sign({ public_id: publicId, timestamp }, apiSecret);

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus media lama dari Cloudinary.");
  }
}

export async function deleteImages(publicIds: Array<string | null | undefined>) {
  const unique = [...new Set(publicIds.filter((id): id is string => Boolean(id)))];
  await Promise.allSettled(unique.map((id) => deleteImage(id)));
}
