# Momena — Focal Point / Crop V1

## Tujuan
Menyimpan titik fokus foto agar `object-cover` tidak memotong bagian penting foto secara tidak terkontrol pada template.

## Data model
Setiap media utama menyimpan koordinat X/Y dalam persen (0–100):
- `coverImagePositionX`, `coverImagePositionY`
- `groomPhotoPositionX`, `groomPhotoPositionY`
- `bridePhotoPositionX`, `bridePhotoPositionY`

Default `50 / 50`, sehingga invitation lama tetap tampil center setelah migration.

## Editor
Setelah foto tersedia, field media menampilkan kontrol Horizontal dan Vertikal serta tombol Reset. Preview langsung memakai posisi yang dipilih.

Saat foto baru diupload, focal point otomatis kembali ke 50 / 50 agar posisi dari foto lama tidak ikut terbawa.

## Renderer
Focal point diterapkan pada:
- Cover/Hero Elegant
- Groom/Bride Elegant
- Cover/Hero Minimal
- Groom/Bride Minimal
- Cover/Hero Modern
- Groom/Bride Modern
- shared Hero fallback
- background opening/cover yang memakai CSS background image

Fallback Groom/Bride dari gallery lama tetap memakai posisi center 50 / 50 karena gallery belum memiliki focal point per-item.

## Migration
`prisma/migrations/20260821110000_add_photo_focal_points/migration.sql`

Pipeline production yang sudah ada akan menjalankan `prisma migrate deploy` sebelum Next build pada production Vercel.

## Catatan
V1 adalah focal-point positioning, bukan destructive crop. File asli Cloudinary tidak diubah. Ini penting agar satu foto bisa dirender pada rasio berbeda tanpa kehilangan data gambar asli.
