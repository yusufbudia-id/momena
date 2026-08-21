# Momena Media System V1

## Yang sudah ditambahkan

- Upload foto langsung ke Cloudinary melalui server route Momena.
- API secret Cloudinary tidak pernah dikirim ke browser.
- Validasi JPG/PNG/WebP dan ukuran maksimal 10 MB.
- Progress upload pada cover, foto mempelai, dan gallery.
- Field khusus `groomPhotoUrl` dan `bridePhotoUrl`.
- Cloudinary `publicId` disimpan agar media lama dapat dibersihkan.
- Gallery mendukung multiple upload, thumbnail, caption, hapus, dan reorder.
- Elegant, Minimal, dan Modern memakai foto Groom/Bride khusus dengan fallback ke gallery lama.
- Saat invitation disimpan setelah media lama diganti/dihapus, media lama dibersihkan dari Cloudinary.
- Saat invitation dihapus, media yang memiliki `publicId` ikut dibersihkan.

## Setup

Isi `.env.local`:

```env
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

Jalankan migrasi dan regenerate Prisma Client:

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

Migration yang ditambahkan:

`prisma/migrations/20260821090000_add_media_fields/migration.sql`

## Catatan desain data

Foto mempelai tidak lagi secara konseptual bergantung pada `gallery[0]` dan `gallery[1]`.
Fallback ke gallery lama tetap dipertahankan supaya invitation lama tidak rusak.

## Batasan V1

Jika user mengupload media baru lalu meninggalkan halaman create tanpa menyimpan atau menghapus foto tersebut, file yang baru terupload dapat menjadi orphan di Cloudinary. Cleanup replacement/removal dalam sesi sudah ditangani, tetapi cleanup otomatis untuk abandoned draft membutuhkan mekanisme pending-upload/TTL dan sebaiknya dibuat di Media System V2.

Focal point/crop belum disimpan. Itu tahap berikutnya setelah upload flow stabil.
