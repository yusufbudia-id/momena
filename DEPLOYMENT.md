# Checklist Sebelum Deploy — Momena

## 0. Perbaikan wajib (sudah dilakukan)

`package.json` sekarang punya `"postinstall": "prisma generate"`. Tanpa ini,
Vercel akan `npm install` lalu langsung `next build` tanpa pernah generate
Prisma Client — persis error yang kamu alami di lokal
(`@prisma/client did not initialize yet`). **Jangan hapus script ini.**

## 1. Siapkan Database (Supabase)

1. Buat project di [supabase.com](https://supabase.com) kalau belum ada.
2. Ambil 2 connection string dari **Project Settings → Database**:
   - **Connection pooling** (port `6543`, ada `?pgbouncer=true`) → ini jadi `DATABASE_URL`.
   - **Direct connection** (port `5432`) → ini jadi `DIRECT_URL`.
3. Isi `.env` lokal dengan 2 string itu (kalau belum).
4. Jalankan dari lokal (bukan di Vercel — migration jangan jalan otomatis saat build):
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
   Ini akan menerapkan 3 migration yang ada (`init`, `add_couple_quote_video`,
   `add_rsvp_message`) dan mengisi 1 admin + 3 template.
5. Cek di Supabase Table Editor: tabel `users`, `templates`, dst sudah ada isinya.

## 2. Push ke Git

Vercel deploy dari repo Git (GitHub/GitLab/Bitbucket).

```bash
git init                      # kalau belum ada repo
git add .
git commit -m "Momena MVP siap deploy"
git remote add origin <url-repo-kamu>
git push -u origin main
```

Pastikan `.env` **tidak ikut ter-commit** (sudah ada di `.gitignore`).

## 3. Import ke Vercel

1. [vercel.com/new](https://vercel.com/new) → import repo Momena.
2. Framework preset: Vercel otomatis mendeteksi Next.js — biarkan default.
3. **Environment Variables** (Settings → Environment Variables), isi persis
   seperti `.env` lokal kamu:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | connection pooling Supabase (port 6543) |
   | `DIRECT_URL` | direct connection Supabase (port 5432) |
   | `NEXT_PUBLIC_APP_URL` | URL production kamu, mis. `https://momena.vercel.app` (update lagi kalau nanti pakai custom domain) |
   | `NEXT_PUBLIC_SUPABASE_URL` | (isi kalau dipakai) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (isi kalau dipakai) |

   `AUTH_*` dan `CLOUDINARY_*` **belum perlu diisi** — belum dipakai kode.

4. Klik **Deploy**.

## 4. Setelah deploy pertama berhasil

- Buka URL production, cek `/` (landing), `/templates`, `/dashboard`,
  `/invitations`.
- Coba alur penuh: buat invitation → publish → buka link `/i/[slug]` →
  isi RSVP → cek muncul di guest book → cek admin lihat di
  `/invitations/[id]/rsvp`.
- Kalau pakai custom domain: hubungkan di Vercel (Settings → Domains), lalu
  **update `NEXT_PUBLIC_APP_URL`** ke domain itu dan redeploy — variabel ini
  dipakai untuk metadata OG, sitemap, dan robots.txt.

## 5. Uji sesuai rencana Sprint 7 kamu

- Buka di HP Android & iPhone asli (bukan cuma resize browser desktop).
- Kirim link undangan ke chat WhatsApp sendiri, cek preview OG (gambar,
  judul, deskripsi) muncul benar sebelum link dibuka.
- Cek Lighthouse (Chrome DevTools) di halaman `/i/[slug]` — target semua
  kategori >95 sesuai target Sprint 5.5.

## ⚠️ 6. Satu keputusan yang perlu kamu ambil sebelum benar-benar publik

**`/dashboard` saat ini tidak dilindungi apa pun.** Karena Auth.js sengaja
ditunda, siapa pun yang tahu/menebak URL `/dashboard` atau `/invitations`
bisa melihat dan mengedit **semua** invitation — bukan cuma miliknya sendiri
(`temp-auth.ts` menganggap semua orang adalah admin yang sama).

Ini aman selama URL Vercel kamu belum disebar ke publik (dipakai sendiri
untuk testing). Tapi begitu kamu mulai jualan dan orang lain tahu domainnya,
ini jadi risiko nyata — bukan cuma soal privasi data pelanggan, tapi siapa
saja bisa menghapus/mengubah invitation orang lain.

Opsi realistis sebelum Auth.js beneran jadi (pilih salah satu, keduanya
cepat dikerjakan, tidak melanggar prinsip "tidak nambah fitur"):
- **Vercel Password Protection** (fitur bawaan Vercel di beberapa paket) —
  tinggal aktifkan di project settings, tanpa ubah kode sama sekali.
- **Middleware Basic Auth sementara** — beberapa baris `middleware.ts` yang
  mengunci `/dashboard` & `/invitations` dengan 1 username/password statis
  dari environment variable. Ini pagar sementara, bukan Auth.js, tapi cukup
  untuk melindungi data pelanggan sebelum Sprint auth beneran dikerjakan.

Kabari kalau mau aku bikinkan opsi middleware-nya — cepat, dan tidak
mengganggu roadmap.

## Yang masih perlu diingat (bukan blocker, tapi jangan lupa)

- `next.config.ts` images.remotePatterns masih `hostname: "**"` (semua
  domain HTTPS diizinkan) — persempit ke `res.cloudinary.com` begitu upload
  Cloudinary jadi satu-satunya cara masukkan foto.
- Migration ditulis manual (bukan hasil `prisma migrate dev` resmi) — sudah
  divalidasi lewat langkah 1 di atas saat kamu jalankan di lokal.
