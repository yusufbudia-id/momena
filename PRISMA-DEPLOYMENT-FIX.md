# Prisma Production Migration Fix

Masalah yang diperbaiki: source code/Prisma Client sudah memakai kolom baru, tetapi database production Vercel belum menjalankan migration yang tersedia di `prisma/migrations`.

## Perubahan

- Menambahkan `npm run prisma:deploy` -> `prisma migrate deploy`.
- Menambahkan `vercel-build` yang:
  - menjalankan `prisma migrate deploy` hanya saat `VERCEL_ENV=production`;
  - tidak menjalankan migration pada Preview/Development deployment;
  - menghentikan build dengan pesan jelas jika `DIRECT_URL` belum tersedia pada Production;
  - menjalankan `next build` setelah migration selesai.

## Migration yang sudah ada di project

- `20260810000000_add_parents_names` -> `groomParents`, `brideParents`
- `20260811000000_add_instagram_handles`
- `20260812000000_add_story`
- `20260821090000_add_media_fields`

Jadi tidak perlu membuat kolom `groomParents` lagi. Database production hanya perlu menjalankan pending migration.

## Sebelum redeploy

Pastikan Vercel Production Environment memiliki `DIRECT_URL` yang merupakan direct PostgreSQL connection untuk database yang sama dengan aplikasi.

Untuk memperbaiki database production secara langsung dari mesin lokal yang memakai `.env` production:

```bash
npm run prisma:deploy
npx prisma generate
```

Setelah itu redeploy. Deployment production berikutnya juga akan menjaga migration tetap sinkron otomatis.
