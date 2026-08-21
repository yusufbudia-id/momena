import { NextResponse } from "next/server";

import { deleteImage } from "@/features/media/cloudinary";
import { getCurrentUserId } from "@/lib/temp-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const body = (await request.json()) as { publicId?: string };
    if (!body.publicId) {
      return NextResponse.json({ error: "publicId wajib diisi." }, { status: 400 });
    }
    if (!body.publicId.startsWith(`momena/${userId}/`)) {
      return NextResponse.json({ error: "Media tidak boleh dihapus." }, { status: 403 });
    }
    await deleteImage(body.publicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus foto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
