# Product Requirements Document (PRD)

**English Sepulang Kerja (ESK) Platform**  
**Version:** 2.1.0  
**Date:** 2026-05-10  
**Status:** Production  

---

## 1. Executive Summary

ESK Platform adalah platform web untuk les bahasa Inggris "English Sepulang Kerja" yang memungkinkan calon siswa melihat kursus, mendaftar secara instan via WhatsApp, serta menyediakan dashboard admin untuk mengelola kursus, siswa, jadwal, dan konten landing page.

---

## 2. Product Vision

> "Platform les bahasa Inggris dengan pendaftaran instan via WhatsApp. Pilih kelas, isi form, langsung terhubung ke admin."

---

## 3. Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework | Next.js | 16.2.5 (App Router, Turbopack) |
| Language | TypeScript | 5.x (Strict Mode) |
| Styling | Tailwind CSS | v4 |
| UI Components | shadcn/ui + Radix UI | Latest |
| Database | PostgreSQL (Supabase) | Latest |
| ORM | Drizzle ORM | Latest stable |
| Auth | Supabase Auth | Latest |
| Calendar | FullCalendar React | Latest |
| Icons | Lucide React + Inline SVG | — |
| Testing | Playwright + pytest | Latest |
| Deployment | Vercel | Latest |

---

## 4. Functional Requirements

### 4.1 Landing Page (Public)

#### FR-LP-01: Hero Section
- **Given** pengunjung membuka halaman utama  
- **When** halaman dimuat  
- **Then** tampil hero section dengan:
  - Judul hero (editable via CMS)
  - Subtitle hero (editable via CMS)
  - Tombol CTA ke section "Harga & Kelas" (editable via CMS)
  - Navigasi sticky header dengan logo dan tombol "Lihat Kelas"

#### FR-LP-02: Course Listing
- **Given** ada kursus aktif di database  
- **When** pengunjung scroll ke section "Harga & Kelas"  
- **Then** tampil grid kartu kursus (1–3 kolom responsive) dengan:
  - Nama kursus
  - Deskripsi
  - Badge mode (Online / Offline / Online & Offline)
  - Jumlah pertemuan
  - Harga dengan diskon (strikethrough + harga final)
  - Badge diskon (pulse animation, jika ada)
  - Badge "Gratis" (jika diskon 100%)
  - Tombol "Daftar Sekarang" per kartu

#### FR-LP-03: Registration Form Modal
- **Given** pengunjung mengklik tombol daftar  
- **When** modal form terbuka  
- **Then** tampil form dengan field:
  - Nama Lengkap (wajib)
  - No. WhatsApp (wajib, min 8 digit)
  - Pilihan Kelas (wajib, dropdown dari database)
  - Mode Kelas (wajib, radio: Online / Offline)
  - Kode Referral (opsional)
  - hCaptcha (jika dikonfigurasi)
  - Tombol submit: "Chat WhatsApp untuk Daftar"

#### FR-LP-04: WhatsApp Integration
- **Given** form valid dan hCaptcha lolos (jika aktif)  
- **When** pengunjung submit  
- **Then** sistem generate URL `wa.me` dengan:
  - No. admin dari konfigurasi database
  - Pesan otomatis berisi nama, no. HP, kelas, mode, referral
  - Buka WhatsApp di tab baru
  - Tutup modal form

#### FR-LP-05: Dynamic Content (CMS)
- **Given** admin mengubah konten via dashboard  
- **When** konten disimpan  
- **Then** landing page update otomatis dalam <5 detik (ISR / `revalidatePath`)
- Konten yang dapat diedit:
  - `hero_title`
  - `hero_subtitle`
  - `hero_cta_text`
  - `footer_copyright`

#### FR-LP-06: Footer
- **Given** pengunjung scroll ke bawah  
- **Then** tampil footer dengan teks copyright (editable via CMS)

---

### 4.2 Admin Authentication

#### FR-AUTH-01: Login
- **Given** user belum login  
- **When** mengakses `/admin/*`  
- **Then** redirect ke `/admin/login`
- Form login:
  - Email
  - Password
  - Tombol "Masuk"
  - Loading state saat proses
  - Error message jika kredensial salah

#### FR-AUTH-02: Session Management
- **Given** user sudah login  
- **When** membuka halaman admin  
- **Then** session aktif via Supabase cookie
- Session persist saat refresh halaman

#### FR-AUTH-03: Logout
- **Given** user sudah login  
- **When** mengklik "Keluar" di sidebar  
- **Then** session dihapus dan redirect ke `/admin/login`

#### FR-AUTH-04: Route Protection
- **Given** user tidak terautentikasi  
- **When** mengakses `/admin/*`  
- **Then** middleware redirect ke login dengan query `redirect`

---

### 4.3 Admin Dashboard — Courses

#### FR-ADM-C-01: List Kursus
- **Given** admin berada di `/admin/courses`  
- **Then** tampil tabel dengan kolom:
  - Nama kursus + deskripsi
  - Harga final (+ strikethrough jika diskon)
  - Jumlah pertemuan
  - Badge mode
  - Badge status (Aktif / Nonaktif)
  - Aksi: Edit, Delete

#### FR-ADM-C-02: Tambah Kursus
- **Given** admin mengklik "Tambah Kursus"  
- **When** modal terbuka  
- **Then** tampil form dengan field:
  - Nama Kursus (wajib)
  - Deskripsi (wajib)
  - Harga Dasar (wajib, number)
  - Diskon % (0–100)
  - Jumlah Pertemuan (wajib, min 1)
  - Mode (Online / Offline / Online & Offline)
  - Toggle Status Aktif
  - Validasi client-side + server-side (Zod)
  - Loading state saat submit

#### FR-ADM-C-03: Edit Kursus
- **Given** admin mengklik tombol edit  
- **When** modal terbuka  
- **Then** form terisi data existing; simpan via PUT `/api/courses/:id`

#### FR-ADM-C-04: Hapus Kursus
- **Given** admin mengklik tombol delete  
- **When** modal konfirmasi muncul  
- **Then** tampil pesan konfirmasi; jika ya:
  - Hapus semua jadwal terkait
  - Set `selectedCourseId` siswa terkait ke null
  - Hapus kursus
  - Tampil toast sukses/error
  - Loading state pada tombol delete

#### FR-ADM-C-05: Empty State
- **Given** belum ada kursus  
- **Then** tampil empty state dengan tombol "Tambah Kursus Pertama"

---

### 4.4 Admin Dashboard — Students

#### FR-ADM-S-01: List Siswa
- **Given** admin berada di `/admin/students`  
- **Then** tampil tabel dengan kolom:
  - Nama + No. WhatsApp
  - Kursus (jika ada)
  - Mode
  - Badge status (Aktif / Tidak Aktif / Trial)
  - Kode Referral
  - Aksi: Edit, Delete
- Filter: search nama/no.HP, filter kursus, filter status

#### FR-ADM-S-02: Tambah/Edit Siswa
- Form fields:
  - Nama Lengkap (wajib)
  - No. WhatsApp (wajib, min 8 digit)
  - Pilihan Kursus (dropdown)
  - Mode (Online / Offline)
  - Status (Aktif / Tidak Aktif / Trial)
  - Kode Referral (opsional)
  - Catatan (opsional)
- Validasi Zod + loading state

#### FR-ADM-S-03: Hapus Siswa
- Konfirmasi modal + loading state + toast sukses/error

---

### 4.5 Admin Dashboard — Schedules

#### FR-ADM-SC-01: Calendar View
- **Given** admin berada di `/admin/schedules`  
- **Then** tampil kalender interaktif (FullCalendar) dengan:
  - Event berwarna per kursus
  - Filter kursus
  - Klik tanggal = tambah jadwal
  - Klik event = edit jadwal

#### FR-ADM-SC-02: Tambah/Edit Jadwal
- Modal form dengan field:
  - Kursus (wajib, dropdown)
  - No. Pertemuan (wajib)
  - Tanggal (wajib)
  - Waktu Mulai & Selesai (wajib, validasi end > start)
  - Zoom Link (opsional)
  - Mode (Online / Offline, radio)
  - Pilih Siswa (checkbox list, opsional)
  - Catatan (opsional)
- Loading state + toast

#### FR-ADM-SC-03: Hapus Jadwal
- Tombol hapus di modal edit + konfirmasi overlay + loading + toast

---

### 4.6 Admin Dashboard — Content (CMS)

#### FR-ADM-CN-01: Edit Konten Landing Page
- **Given** admin berada di `/admin/content`  
- **Then** tampil form per section:
  - `hero_title` (text)
  - `hero_subtitle` (textarea)
  - `hero_cta_text` (text)
  - `footer_copyright` (text)
- Setiap section punya tombol "Simpan" independen
- Toast / inline success indicator

---

### 4.7 Admin Dashboard — Settings

#### FR-ADM-ST-01: WhatsApp Config
- Form:
  - No. WhatsApp Admin (wajib, format: kode negara + nomor)
  - Template Pesan (opsional, support placeholder)
- Tombol "Simpan" + loading state

#### FR-ADM-ST-02: Admin Profile
- Form:
  - Email Admin (read-only)
  - Password Baru (opsional)
  - Konfirmasi Password

#### FR-ADM-ST-03: Danger Zone
- Tombol "Hapus Semua Data Siswa" dengan alert konfirmasi

---

### 4.8 Shared UI / UX

#### FR-UI-01: Toast Notifications
- Toast muncul di bottom-right
- Tipe: success (green), error (red), info (gray)
- Auto-dismiss 4 detik
- Muncul untuk semua aksi delete dan error/success API

#### FR-UI-02: Loading States
- Semua tombol aksi (tambah, edit, hapus, simpan) punya loading state
- Spinner muncul saat proses API
- Tombol disabled saat loading
- Tombol "Batal" juga disabled saat form submitting

#### FR-UI-03: Sidebar Navigation
- Menu: Overview, Kursus, Siswa, Jadwal, Konten, Pengaturan
- Menu aktif diberi highlight (background + bold text)
- Active state berdasarkan current pathname

#### FR-UI-04: Cursor Pointer
- Semua elemen `<button>` menampilkan hand cursor (`cursor-pointer`) saat hover

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Landing page LCP < 2 detik
- ISR / revalidate: landing page update < 5 detik setelah CMS change
- Calendar interaction < 500ms

### 5.2 Security
- Admin routes WAJIB authenticated (middleware)
- Form validation client-side DAN server-side (Zod)
- hCaptcha di form pendaftaran (jika dikonfigurasi)
- WhatsApp URL generate di server-side
- No sensitive data in WhatsApp payload

### 5.3 Accessibility
- Semua elemen interaktif punya `data-testid`
- Reduced motion support via media query
- Error messages in Bahasa Indonesia

### 5.4 Design System
- Design tokens via CSS variables (`design-tokens.css`)
- Font: Plus Jakarta Sans (display), Inter (body)
- Border-radius minimum 12–16px untuk cards
- Shadow tint berbasis brand color (Rose Gold)
- Spacing 8px grid system

---

## 6. Database Schema

### 6.1 Models

| Model | Deskripsi |
|-------|-----------|
| `Course` | Data kursus: nama, deskripsi, harga, diskon, jumlah sesi, mode, status aktif |
| `Student` | Data siswa: nama, no. HP, kursus terpilih, mode, status, referral, catatan |
| `Schedule` | Jadwal pertemuan: kursus, tanggal, waktu, mode, zoom link, catatan |
| `ScheduleStudent` | Many-to-many: jadwal ↔ siswa |
| `Content` | CMS konten landing page per section |
| `Admin` | Data admin: email, password hash, role |
| `WhatsAppConfig` | Konfigurasi no. admin & template pesan |

### 6.2 Relasi
- `Student` → `Course` (Many-to-One, nullable)
- `Schedule` → `Course` (Many-to-One)
- `Schedule` ↔ `Student` via `ScheduleStudent` (Many-to-Many)

---

## 7. API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/courses` | List semua kursus |
| POST | `/api/courses` | Buat kursus baru |
| GET | `/api/courses/:id` | Detail kursus |
| PUT | `/api/courses/:id` | Update kursus |
| DELETE | `/api/courses/:id` | Hapus kursus + relasi |
| GET | `/api/students` | List siswa (support filter) |
| POST | `/api/students` | Buat siswa baru |
| GET | `/api/students/:id` | Detail siswa |
| PUT | `/api/students/:id` | Update siswa |
| DELETE | `/api/students/:id` | Hapus siswa |
| GET | `/api/schedules` | List jadwal (support filter) |
| POST | `/api/schedules` | Buat jadwal baru |
| GET | `/api/schedules/:id` | Detail jadwal |
| PUT | `/api/schedules/:id` | Update jadwal |
| DELETE | `/api/schedules/:id` | Hapus jadwal |
| GET | `/api/content` | List konten CMS |
| GET | `/api/content/:section` | Detail konten per section |
| PUT | `/api/content/:section` | Update konten |
| GET | `/api/whatsapp-config` | Get konfigurasi WhatsApp |
| PUT | `/api/whatsapp-config` | Update konfigurasi WhatsApp |

---

## 8. File Structure

```
esk-platform/
├── src/
│   ├── db/
│   │   ├── schema.ts       # Drizzle schema (tables, enums, relations)
│   │   ├── index.ts        # Drizzle client singleton
│   │   └── seed.ts         # Seeder (admin + WhatsApp config)
│   ├── drizzle/            # Drizzle Kit generated migrations
│
├── src/
│   ├── app/
│   │   ├── page.tsx        # Landing page (SSR)
│   │   ├── layout.tsx      # Root layout + fonts
│   │   ├── globals.css     # Tailwind + design tokens
│   │   ├── api/            # API routes
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       └── (dashboard)/
│   │           ├── page.tsx           # Overview
│   │           ├── layout.tsx         # AuthProvider + Sidebar
│   │           ├── courses/page.tsx   # CRUD Kursus
│   │           ├── students/page.tsx  # CRUD Siswa
│   │           ├── schedules/page.tsx # CRUD Jadwal (Calendar)
│   │           ├── content/page.tsx   # CMS Konten
│   │           └── settings/page.tsx  # Pengaturan
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   └── toast-container.tsx
│   │   ├── landing/
│   │   │   ├── landing-client.tsx
│   │   │   ├── course-card.tsx
│   │   │   └── registration-form.tsx
│   │   └── admin/
│   │       └── admin-sidebar.tsx
│   ├── hooks/
│   │   ├── use-auth.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── db.ts           # Drizzle client singleton
│   │   ├── utils.ts        # Currency, discount formatting
│   │   ├── validations.ts  # Zod schemas
│   │   ├── auth.ts         # Auth helpers
│   │   ├── whatsapp.ts     # WhatsApp URL generator
│   │   └── actions/
│   │       ├── course-actions.ts
│   │       ├── registration-actions.ts
│   │       └── auth-actions.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── design-tokens.css
├── tests/
│   ├── pages/              # Playwright Page Objects
│   └── tests/              # E2E test files
├── docs/
│   ├── PRD.md              # This document
│   ├── FEATURES.md         # Feature overview
│   ├── project-context.md  # AI agent rules
│   └── bugfixes/           # Bugfix documentation
├── middleware.ts           # Route protection
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 9. Testing Strategy

### 9.1 E2E Testing (Playwright + POM)
- **Priority 1:** Full user journey: landing → form fill → WhatsApp link
- **Priority 2:** Admin login → CRUD course → verify landing update
- **Priority 3:** Admin schedule CRUD → calendar rendering
- **Priority 4:** Unauthenticated access → redirect to login
- **Priority 5:** Discount display edge cases (0%, 100%)

### 9.2 data-testid Convention
Semua elemen frontend WAJIB memiliki `data-testid` untuk Playwright selectors.

---

## 10. Deployment

- **Production:** Push `main` → Vercel auto-deploy
- **Staging:** Push `staging` → Vercel preview branch
- **Requirement:** E2E tests pass sebelum merge ke `main`

---

## 11. Changelog Summary

### v2.0.0 — 2026-05-09
- Fixed course deletion foreign-key constraint (cascade student course + schedules)
- Added toast notifications for all delete actions
- Added loading states on all CRUD buttons (spinner + disabled)
- Added active menu highlight in admin sidebar
- Added `cursor-pointer` to all buttons globally

### v1.0.0 — Baseline
- Landing page dengan course listing & WhatsApp registration
- Admin dashboard dengan CRUD Courses, Students, Schedules
- CMS Content editor
- WhatsApp configuration settings
- Supabase Auth integration

---

*End of PRD*
