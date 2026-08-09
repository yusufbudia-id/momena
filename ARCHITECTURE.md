# Momena — Project Structure

## Struktur folder

```
momena/
├── prisma/
│   ├── schema.prisma        # datasource + generator, model ditambah per fitur
│   └── seed.ts
├── src/
│   ├── app/                 # routing (App Router)
│   │   ├── (marketing)/     # route group: landing, pricing, dll (public)
│   │   ├── (auth)/          # route group: login, register
│   │   ├── (dashboard)/     # route group: area setelah login
│   │   ├── api/             # route handler (webhook, callback pihak ketiga)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # hasil `shadcn add` — jangan diedit manual, generate ulang
│   │   ├── layout/          # navbar, sidebar, footer, shell
│   │   └── shared/          # komponen reusable lintas fitur (bukan dari shadcn)
│   ├── features/            # 1 folder = 1 domain bisnis, semua kode terkait domain itu menumpuk di sini
│   │   ├── invitation/      # repository.ts  validation.ts  actions.ts  types.ts  (+ components/ nanti)
│   │   ├── template/        # repository.ts  types.ts
│   │   ├── auth/            # (nanti, saat Auth.js masuk)
│   │   └── settings/        # (nanti)
│   ├── lib/                 # infrastruktur inti: db client, auth config, cloudinary client, env
│   ├── hooks/                # custom hook lintas fitur (use-debounce, use-media-query, dst)
│   ├── actions/               # server action lintas fitur/global (mis. logout) — bukan actions 1 fitur
│   ├── types/                  # tipe global (ActionResult<T>, Session, dst)
│   ├── constants/               # nilai statis: role, plan, limit, route path
│   ├── config/                   # konfigurasi app (site config, nav config, dsb — bukan secret)
│   ├── utils/                     # pure function generik: formatDate, slugify, formatCurrency
│   └── styles/                     # css tambahan di luar globals (kalau perlu)
├── .env.example
├── eslint.config.mjs
├── .prettierrc.json
├── next.config.ts
├── tsconfig.json
└── postcss.config.mjs
```

## Aturan penempatan kode

- **Spesifik 1 fitur** → taruh di `src/features/<nama-fitur>/`:
  `repository.ts` (satu-satunya tempat query Prisma untuk domain itu),
  `validation.ts` (Zod schema domain itu), `actions.ts` (Server Action,
  selalu lewat repository — tidak pernah panggil `db.*` langsung),
  `types.ts`. Tidak dipecah ke folder `actions/`, `services/`, atau
  `validators/` terpisah di root.
- **Dipakai ≥2 fitur atau bersifat infrastruktur** → naik ke root (`lib/`,
  `hooks/`, `types/`, `utils/`, dst).
- `lib/` = hal yang menyentuh infrastruktur/eksternal (db, auth, cloudinary, env).
- `actions/` (root) = server action generik lintas fitur (mis. `logout`), server action
  spesifik fitur tetap di `features/<nama>/actions.ts`.
- Folder `services/` sengaja **tidak dipakai** — pemanggilan API pihak ketiga
  yang infrastruktural masuk `lib/` (mis. `lib/cloudinary.ts`), yang spesifik
  1 domain masuk `features/<nama>/repository.ts`.
- Komponen dari `shadcn add <component>` **tidak boleh diedit langsung** — kalau perlu
  variant tambahan, buat wrapper baru di `components/shared/`.

## Model data: Invitation sebagai pusat

`Invitation` adalah entitas inti — semua fitur lain menempel padanya, bukan
berdiri sendiri: `Template` (dipilih), `Gallery`, `Gift`, `Rsvp`, `Settings`
(masing-masing punya `invitationId`). Query fitur lain hampir selalu diawali
dari satu invitation, bukan query lepas lintas tabel.

## Invitation Engine (`components/invitation/` vs `features/invitation/`)

Dua folder berbeda, dua urusan berbeda, sengaja dipisah:

- `features/invitation/` — logika bisnis dashboard (repository, validation,
  Server Actions). Ini yang dipakai admin untuk CRUD. Bicara bahasa Prisma
  (`InvitationWithRelations`, dst).
- `components/invitation/` — mesin render halaman publik `/i/[slug]` +
  katalog template. **Tidak pernah import tipe Prisma langsung** — lihat
  ViewModel di bawah.

### ViewModel & Mapper (pisah Data vs Presentation)

Section & template **tidak menerima entity Prisma**. Mereka menerima
`InvitationViewModel` (`components/invitation/view-model.ts`) — bentuk data
yang dirancang untuk kebutuhan tampilan, bukan bentuk tabel database.
`components/invitation/mapper.ts` (`toInvitationViewModel()`) adalah
**satu-satunya tempat** yang tahu cara mengubah data Prisma jadi ViewModel.

Kenapa: kalau nanti schema berubah (mis. `groomName`/`brideName` diganti
`Participants[]` di v2), yang berubah cukup `mapper.ts` — semua section dan
template tetap sama persis, tidak disentuh.

### Section Library

`sections/` — 12 komponen Lego, semua menerima `{ invitation: InvitationViewModel, guestName? }`
yang sama persis dan tidak tahu dirinya dipanggil dari template mana:
`Hero`, `BrideGroom`, `Quote`, `LoveStory`, `Timeline`, `Countdown`, `Gallery`,
`Video`, `Location`, `Gift`, `Rsvp`, `Footer`. Section yang datanya kosong
(`quote` null, `gallery` `[]`, dst) me-render `null` sendiri — template tidak
perlu tahu/cek itu.

**PENGECUALIAN — Elegant punya section sendiri.** Sejak permintaan untuk
memisahkan Elegant supaya independen, `templates/elegant/sections/` adalah
**duplikat penuh** dari `components/invitation/sections/` (bukan re-export),
dengan import path disesuaikan (`../../types` → `../../../../types`, dst).
`templates/elegant/index.tsx` import dari `./sections`, BUKAN `../../sections`.

Konsekuensinya, disiplin ini WAJIB dijaga ke depan:
- **`templates/elegant/sections/Hero/index.tsx` sudah DIVERGEN** dari versi
  shared — gaya "Magazine Style" (foto dibingkai arch, nama mempelai
  overlap foto, divider emas). Section lain di folder ini masih identik
  isinya dengan versi shared (baru beda lokasi/path), tapi bisa didandani
  sendiri kapan saja tanpa memengaruhi Minimal/Modern.
- **Perbaikan bug di section bersama (`components/invitation/sections/`)
  TIDAK otomatis ikut ke `templates/elegant/sections/`** — kalau nemu bug
  di, katakanlah, `Gift` atau `Rsvp`, cek apakah perlu diperbaiki di DUA
  tempat (shared + Elegant lokal), terutama kalau versi Elegant belum
  didandani ulang dan masih identik.
- Minimal & Modern tidak terpengaruh sama sekali — keduanya tetap import
  dari `../../sections` (shared), tidak dilihat oleh perubahan ini.

`guestName` (dari `?to=` di URL `/i/[slug]`) itu **konteks per-kunjungan**,
bukan bagian data invitation — makanya prop terpisah, bukan field di
`InvitationViewModel` (yang sama untuk semua pengunjung). `Rsvp` pakai ini
untuk prefill nama; template boleh mengabaikannya kalau tidak relevan.

### Cover Gate & Music Toggle

Ketiga template (Elegant/Minimal/Modern) punya layar pembuka "Buka
Undangan" (`CoverGate`) dan tombol musik latar (`MusicToggle`) — dipakai di
semua, tampilannya beda-beda sesuai karakter tiap template.

- **State-nya dipusatkan di hook** (`components/invitation/hooks/`):
  `useInvitationGate()` (buka/tutup + kunci scroll body) dan
  `useMusicToggle()` (play/pause + `play()` terpisah untuk autoplay).
  Template manapun yang mau nambah gate/musik tinggal pakai hook ini,
  tidak perlu tulis ulang logic-nya.
- **`CoverGate` sengaja LOKAL per template** (bukan shared component) —
  visualnya beda jauh per karakter (Elegant: hairline emas + serif italic;
  Minimal: polos, tombol garis bawah; Modern: full-bleed foto gelap +
  huruf kapital). Kalau dipaksa jadi 1 komponen shared, propnya akan penuh
  flag `variant` yang lebih ribet daripada tiga fungsi kecil terpisah.
- **`MusicToggle` (tombolnya) shared** (`components/invitation/music-toggle.tsx`)
  — presentational murni, style default pakai token warna global
  (`bg-surface`, `border-accent`, dst) yang otomatis ikut palet tiap
  template lewat CSS variable cascade (lihat bagian palet Elegant di atas),
  jadi tidak perlu override manual di Minimal/Modern.
- Klik tombol "Buka Undangan" = user-gesture, dipakai juga untuk memicu
  `music.play()` (autoplay) — di luar momen itu browser akan block
  `audio.play()` diam-diam (sudah ditangani, gagal-senyap, tombol toggle
  tetap bisa dicoba manual).
- `InvitationViewModel.musicUrl` (dari `Settings.musicUrl`, field yang
  sudah ada di schema sejak Sprint 1 tapi baru dipakai sekarang) — semua
  template otomatis sembunyikan `MusicToggle` kalau kosong (belum ada UI
  edit Settings, jadi untuk sekarang harus diisi manual lewat DB).

### Template + Manifest

- `templates/<nama>/index.tsx` — hanya menyusun urutan section + pembungkus
  layout (lebar, spacing). **Tidak ada logika/fetch di sini.**
- `templates/<nama>/manifest.ts` — metadata co-located: `name`, `slug`,
  `author`, `version`, `premium`, `thumbnail`, `description`, `sections`,
  `component`. Ini yang dibaca dashboard (`/templates`), bukan hardcode.
- `templates/registry.ts` — satu-satunya tempat pendaftaran. Menambah
  template baru = 1 folder (`index.tsx` + `manifest.ts`) + 1 baris di sini.
  `src/app/i/[slug]/page.tsx` HANYA memanggil `getTemplateComponent(slug)`,
  tidak pernah `if`/`switch` per template.

Manifest (kode) ≠ tabel `Template` (database) — keduanya sengaja dipisah:
DB tetap sumber untuk `id` (FK ke `Invitation.templateId`) & `isActive`,
manifest sumber untuk segala hal soal tampilan. `template-catalog.ts`
menggabungkan keduanya by slug untuk dipakai wizard & halaman katalog; baris
DB yang slug-nya belum ada manifest-nya otomatis dilewati (belum bisa dipakai).

### Katalog & Preview (`/templates`)

Halaman dashboard `/templates` menampilkan seluruh `templateManifests` gaya
Canva: thumbnail, badge Premium, tombol **Preview** (buka
`/templates/preview/[slug]` — route publik di luar shell dashboard, full-page,
pakai `demoInvitationViewModel` di `demo-data.ts`, TIDAK pernah menyentuh
database) dan **Use Template** (ke `/invitations/new?template=slug`, wizard
otomatis prapilih template itu).

Halaman publik `/i/[slug]` sengaja 404 (`notFound()`, bukan redirect) untuk
invitation yang belum di-publish — link baru hidup setelah status `PUBLISHED`.

## Polish & Production Ready

Beberapa keputusan yang perlu diketahui saat lanjut kerja di area ini:

- **`next.config.ts` images.remotePatterns pakai `hostname: "**"`** (izinkan
  semua domain HTTPS) — sengaja, karena form gallery/cover masih terima URL
  foto bebas dari user (belum ada upload Cloudinary). **Persempit ke
  `res.cloudinary.com` saja** begitu upload Cloudinary jadi satu-satunya cara
  masukkan foto — jangan biarkan wildcard ini permanen.
- **`robots.ts`** melarang crawl `/dashboard`, `/invitations`, `/i/` (area
  admin & link undangan privat). Kalau nanti ada halaman publik baru yang
  boleh diindeks, tambahkan ke `allow`, bukan hapus `disallow` yang ada.
- **`Reveal`** (`components/invitation/reveal.tsx`) adalah SATU-SATUNYA pola
  animasi masuk yang dipakai di halaman undangan (fade + slide-up via
  Motion, `whileInView`, sekali per section). Jangan tambah pola animasi lain
  di section baru — bungkus dengan `Reveal` yang sama supaya tetap konsisten.
- **Toast (`sonner`)**: setiap Server Action yang dipanggil dari Client
  Component (create/update/delete/publish/copy) HARUS diikuti
  `toast.success()`/`toast.error()` di pemanggilnya — polanya sudah ada di
  `invitation-wizard.tsx` & `invitation-actions-cell.tsx`, ikuti pola yang
  sama untuk action baru.
- Template (`elegant`/`minimal`/`modern`) semuanya `"use client"` — wajib,
  karena `next/dynamic` dengan `{ ssr: false }` (dipakai untuk `Countdown`)
  tidak diizinkan Next.js di Server Component.
- **`DataTable`/`ColumnDef` HARUS didefinisikan di dalam Client Component**,
  tidak boleh di Server Component lalu dioper sebagai prop. `columns` berisi
  fungsi (`cell: (row) => ...`), dan fungsi tidak bisa "menyeberang" dari
  Server ke Client Component lewat props (RSC serialization error saat
  runtime — `tsc`/`eslint` tidak mendeteksi ini, cuma ketahuan saat
  `next dev` beneran jalan). Polanya: buat komponen client kecil yang
  membungkus `columns` + `<DataTable>` sekaligus (lihat
  `features/invitation/components/invitations-table.tsx`), Server Component
  cukup oper `data` (plain object/array, aman diserialisasi) ke situ.
- Landing page sengaja **tidak punya `loading.tsx`** — halamannya statis,
  tidak ada fetch data yang bisa di-suspend, jadi skeleton tidak akan pernah
  terpicu.
- **`typedRoutes` sengaja TIDAK dipakai** (dihapus dari `next.config.ts`).
  Project ini banyak dynamic route (`/i/[slug]`, `/templates/preview/[slug]`,
  `/invitations/[id]/edit`, `/invitations/[id]/rsvp`) yang href-nya dibangun
  dari template string — typed routes memaksa cast `as Route` di banyak
  tempat tanpa manfaat sepadan untuk project seukuran ini. Kalau nanti mau
  diaktifkan lagi, audit ulang semua `<Link href>`, `router.push`,
  `router.replace`, dan `redirect` sekaligus (jangan sedikit-sedikit).

## Prisma 7

Project ini pakai **Prisma 7** (rilis November 2025) — kalau kamu terbiasa
dengan Prisma 6, ada beberapa perubahan besar yang perlu diketahui:

- **`schema.prisma` tidak lagi boleh berisi `url`/`directUrl`** di block
  `datasource`. Connection string sekarang diatur di **`prisma.config.ts`**
  (file baru di root project) — dipakai Prisma CLI untuk migrate/seed, isinya
  `DIRECT_URL` (bukan `DATABASE_URL`, karena migrate butuh koneksi langsung,
  bukan lewat pgbouncer).
- **`PrismaClient` wajib driver adapter** — tidak bisa lagi
  `new PrismaClient()` polos. `src/lib/db.ts` dan `prisma/seed.ts`
  masing-masing bikin `PrismaPg` adapter sendiri (`@prisma/adapter-pg` + `pg`):
  `db.ts` pakai `DATABASE_URL` (pooled, untuk runtime app di Next.js),
  `seed.ts` pakai `DIRECT_URL` (dijalankan standalone via `tsx`, bukan
  lewat Next.js).
- **Generator tetap `prisma-client-js`** (bukan `prisma-client` yang baru,
  yang direkomendasikan Prisma) — sengaja, karena `prisma-client` dengan
  custom `output` punya bug module-resolution yang dikenal dengan Turbopack
  (`next dev --turbopack`, yang dipakai project ini). Kombinasi
  `prisma-client-js` + tanpa `output` = tetap generate ke `node_modules`
  seperti biasa, semua import `from "@prisma/client"` di project ini tidak
  perlu berubah.
- Kalau nanti upgrade Prisma lagi dan ada error mirip
  `The datasource property 'url' is no longer supported` atau
  `requires either "adapter"... to be provided to PrismaClient constructor` —
  itu tanda ada breaking change baru, cek
  [dokumentasi upgrade Prisma](https://www.prisma.io/docs/guides/upgrade-prisma-orm)
  dulu sebelum ubah kode.

## Alias import

Sudah dikonfigurasi di `tsconfig.json`:

```
@/*            -> src/*
@/app/*        -> src/app/*
@/components/* -> src/components/*
@/features/*   -> src/features/*
@/lib/*        -> src/lib/*
@/hooks/*      -> src/hooks/*
@/actions/*    -> src/actions/*
@/types/*      -> src/types/*
@/constants/*  -> src/constants/*
@/config/*     -> src/config/*
@/utils/*      -> src/utils/*
@/styles/*     -> src/styles/*
```

## Environment

- `DATABASE_URL` → pooled connection (pgbouncer, port 6543) untuk runtime.
- `DIRECT_URL` → direct connection (port 5432) khusus `prisma migrate`.
- Semua env divalidasi lewat Zod di `src/lib/env.ts` — import `env` dari situ,
  jangan `process.env.X` langsung di kode fitur, supaya error env hilang/salah
  ketahuan saat boot, bukan saat runtime.

## Status

| Tahap | Status |
|---|---|
| Struktur project | ✅ |
| Prisma schema (User, Template, Invitation +groomName/brideName/quote/videoUrl, Gallery, Rsvp, Gift, Settings) | ✅ |
| Database migration | ⚠️ 3 file SQL ditulis manual: `20260724000000_init/`, `20260725000000_add_couple_quote_video/`, `20260726000000_add_rsvp_message/` (bukan hasil `prisma migrate dev` resmi — lihat catatan di bawah), belum di-apply ke DB manapun |
| Seed (`prisma/seed.ts`): admin + 3 template (Elegant, Minimal, Modern) | ✅ |
| Repository layer (`features/invitation`, `features/template`) | ✅ |
| Zod validation (`features/invitation/validation.ts`) | ✅ |
| Server Actions CRUD Invitation (`features/invitation/actions.ts`) | ✅ |
| Dashboard UI (layout, sidebar, topbar, stat card, data table) | ✅ |
| Dashboard Functional: stats, Invitation List (search+pagination+empty state), wizard Create/Edit, Delete (confirm dialog), Publish (+copy link) — semua via repository/Server Actions, tanpa dummy data | ✅ |
| Invitation Engine (`/i/[slug]`, Template Registry, sections reusable, metadata SEO) | ✅ |
| Premium Template System: ViewModel/mapper (pisah data & presentation), Template Manifest, 12 section (termasuk BrideGroom/Quote/Video), 3 template lengkap (Elegant/Minimal/Modern), katalog `/templates` + preview + demo data | ✅ |
| Landing Page: `(marketing)` route group (Nav+Footer), Hero, Fitur, Template Showcase (live preview via iframe ke `/templates/preview/[slug]`, bukan screenshot), CTA | ✅ |
| Polish & Production Ready: mobile (safe-area, dvh, 44px touch target, no-zoom input), performance (next/image, dynamic import Countdown, font swap), animasi (Motion, konsisten fade+slide via `Reveal`), SEO (sitemap/robots/manifest/favicon/OG/JSON-LD), error boundary + 404 global, toast (sonner) di semua aksi (save/publish/delete/copy) | ✅ |
| RSVP & Guest Book: form RSVP publik di `/i/[slug]` (nama, WA opsional, jumlah tamu, kehadiran, ucapan) → simpan ke database → tampil di guest book (terbaru dulu); admin lihat di `/invitations/[id]/rsvp` (Nama/Status/Jumlah Tamu/Tanggal) | ✅ |
| Auth.js | ⬜ (sengaja ditunda — lihat urutan kerja) |

### Catatan penting soal migration

`prisma migrate dev` / `prisma generate` **tidak bisa dijalankan di sandbox ini**
karena engine Prisma di-download dari `binaries.prisma.sh`, domain yang diblokir
oleh network sandbox. SQL migration yang ada sekarang ditulis manual mengikuti
format standar Prisma, belum divalidasi oleh Prisma engine.

Sebelum dipakai serius, jalankan di environment kamu sendiri (yang punya akses
penuh + `DATABASE_URL`/`DIRECT_URL` Supabase asli):

```bash
npx prisma migrate dev --name init
```

Prisma akan mendeteksi folder migration yang sudah ada dan memvalidasinya
terhadap schema — kalau ada perbedaan, Prisma akan menandainya.

## Yang belum dibuat (sengaja)

- Setup Auth.js — tinggal isi `AUTH_*` env dan buat `src/lib/auth.ts`, ditunda
  sampai dashboard fungsional (biar begitu login jadi, dashboard tidak kosong).
  Tombol "Masuk" & "Coba Gratis" di `MarketingNav`/landing page untuk sekarang
  masih mengarah langsung ke `/dashboard` (bypass) — ganti begitu Auth.js ada.
- Setup Cloudinary — tinggal isi `CLOUDINARY_*` env dan buat `src/lib/cloudinary.ts`.
- shadcn/ui belum di-init — jalankan `npx shadcn@latest init` lalu
  `npx shadcn@latest add button` dst sesuai kebutuhan.
- RSVP submit publik **sudah jalan** (`features/rsvp/`, section `Rsvp` di
  `/i/[slug]`, admin lihat di `/invitations/[id]/rsvp`). Yang sengaja BELUM
  dibuat (di luar Definition of Done Sprint 6): balasan admin, like/emoji,
  pagination guest book, moderasi, export Excel.
  Endpoint edit `Settings` juga belum ada UI-nya (dibuat otomatis dengan
  default saat invitation dibuat). Gallery & Gift sudah tertangani lewat
  `invitation.repository`/wizard (create/update replace-all).
- Tabel **Story** — section `LoveStory` & `Timeline` sudah jadi (mengambil
  `invitation.story` dari ViewModel) tapi `mapper.ts` selalu mengembalikan
  `[]` karena belum ada tabelnya di schema. Begitu tabelnya ada, cukup ubah
  `mapper.ts` — section tidak perlu disentuh.
- Konsep **Theme** (varian warna/font per template, terpisah dari layout) —
  `TemplateManifest` sudah punya slot untuk berkembang ke arah ini, field
  skema/warna belum ditambahkan secara formal. Tapi sudah ada preseden
  nyata: **Elegant** override palet lewat CSS custom property di wrapper
  template (`luxuryTheme` di `templates/elegant/index.tsx`) — karena semua
  section pakai class seperti `bg-paper`/`text-ink` yang resolve ke
  `var(--color-*)`, override di level template "menembus" ke semua section
  tanpa section-nya diubah. Kalau nanti Theme jadi formal (mis. tabel
  `Theme` dengan pilihan warna dari admin), pola CSS-variable-per-wrapper
  ini bisa langsung dipakai — tinggal generate object `luxuryTheme`-nya
  dari data, bukan hardcode.
- Halaman `/settings` — link di sidebar sudah ada, halamannya belum
  (`/templates` sudah ada, katalog gaya Canva dengan Preview & Use Template).
- Thumbnail template asli — `manifest.thumbnail` & `Template.thumbnailUrl`
  masih path placeholder (`/templates/elegant/thumbnail.jpg`), belum ada
  file gambarnya. Kartu di `/templates` & step Template di wizard masih
  pakai kotak placeholder + nama.
- `src/lib/temp-auth.ts` — pengganti sementara session Auth.js, ambil user admin
  hasil seed by email. Hapus begitu Auth.js terpasang.
- Upload foto (Cloudinary) — form gallery/cover & section Gallery saat ini
  masih pakai `<img>` + URL manual, bukan `next/image` (karena domain foto
  belum tentu terdaftar di `next.config.ts`).
- `src/assets/{fonts,music,background,decorations,patterns}/` — folder sudah
  disiapkan (kosong), belum ada aset & belum dipakai template mana pun.

## Setup lanjutan (belum dijalankan di sini)

```bash
npm install
npx shadcn@latest init
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```
