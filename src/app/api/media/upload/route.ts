import { NextResponse } from "next/server";

import { uploadImage } from "@/features/media/cloudinary";
import { getCurrentUserId } from "@/lib/temp-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File foto wajib dipilih." }, { status: 400 });
    }

    const uploaded = await uploadImage(file, userId);
    return NextResponse.json({ success: true, ...uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload foto gagal.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
