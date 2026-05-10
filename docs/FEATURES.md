# ESK Platform — Features & Functionality Overview

**Version:** 2.1.0  
**Last Updated:** 2026-05-10  

---

## Table of Contents

1. [Landing Page (Public)](#1-landing-page-public)
2. [Admin Authentication](#2-admin-authentication)
3. [Admin Dashboard — Courses](#3-admin-dashboard--courses)
4. [Admin Dashboard — Students](#4-admin-dashboard--students)
5. [Admin Dashboard — Schedules](#5-admin-dashboard--schedules)
6. [Admin Dashboard — Content (CMS)](#6-admin-dashboard--content-cms)
7. [Admin Dashboard — Settings](#7-admin-dashboard--settings)
8. [Shared UX Patterns](#8-shared-ux-patterns)
9. [API Layer](#9-api-layer)
10. [Database](#10-database)
11. [Bugfixes & Improvements](#11-bugfixes--improvements)

---

## 1. Landing Page (Public)

### 1.1 Animated Gradient Background
- Landing page menggunakan animated gradient (bukan solid `#FFF8F0`)
- Animasi slow-shift 18 detik antara warna brand: Cream, Warm Blush, Light Rose
- Menggunakan CSS `@keyframes gradientShift` dengan `background-size: 400% 400%`
- Wajib support `prefers-reduced-motion` — nonaktifkan semua animasi
- File: `src/styles/landing.css`

### 1.2 Hero Section
- Sticky navigation bar dengan logo ESK, CTA "Lihat Kelas", dan link "Tentang"
- Hero heading & subtitle yang editable via CMS
- Tombol CTA utama menuju section harga kelas
- Decoratif Lucide icons di background (GraduationCap, BookOpen, Sparkles) dengan opacity 4-5%
- Entrance animation staggered: judul (0ms) → subtitle (100ms) → CTA (200ms)
- Hover effects: scale(1.02) + shadow-lg + translateY(-2px)
- Navbar sticky dengan backdrop blur transparan→solid saat scroll

### 1.3 Company Profile ("Tentang ESK")
- **Sub A — Teks Profil:** Headline + paragraf tentang ESK (hardcoded statis)
- **Sub B — Galeri Foto:** Grid 1-4 foto dari database (CMS upload via Supabase Storage), empty state jika belum ada foto
- **Sub C — Value Propositions:** 4 cards — Jadwal Fleksibel (CalendarClock), Pengajar Berpengalaman (Award), Biaya Terjangkau (BadgePercent), Sertifikat Resmi (FileCheck)
- Staggered scroll animation via Intersection Observer
- Responsive grid: 1 → 2 → 4 kolom
- File: `src/components/landing/company-profile.tsx`

### 1.4 Course Listing ("Harga & Kelas")
- Grid responsive: 1 kolom (mobile) → 2 kolom (tablet) → 3 kolom (desktop)
- Header dengan decorative Sparkles icons di samping teks
- Kartu pertama (index 0) mendapat featured styling (border primary + shadow berbeda) dan badge "Paling Populer"
- Staggered entrance animation per kartu (delay 80ms)
- Setiap kartu menampilkan:
  - Nama kursus + badge mode dengan Lucide icon (Monitor=online, Users=offline, Globe=both)
  - Deskripsi singkat
  - Jumlah pertemuan
  - Harga dengan logika diskon (sama seperti sebelumnya)
  - Tombol "Daftar Sekarang" dengan hover scale effect

### 1.5 Testimony Section ("Apa Kata Mereka")
- **Jika ≤ 3 testimoni:** Static grid, semua visible (1-3 kolom responsive)
- **Jika > 3 testimoni:** Embla Carousel dengan:
  - Autoplay 4 detik, infinite loop (`loop: true`)
  - Smooth slide transition (bawaan Embla)
  - Pause on hover (`stopOnMouseEnter: true`)
  - Autoplay tetap jalan setelah klik manual (`stopOnInteraction: false`)
  - Navigation prev/next buttons
  - Dots indicator synced dengan slide aktif via React state + `onSelect` event
  - Keyboard navigation (arrow keys)
  - `prefers-reduced-motion` respect
- Setiap kartu: foto (opsional), nama, asal, quote italic, rating bintang, icon quote dekoratif
- Data dari database (tabel `Testimonial`, filter `isActive = true`)
- File: `src/components/landing/testimony-carousel.tsx`

### 1.6 Registration Form Modal
- Trigger: klik "Daftar Sekarang" di kartu kursus atau tombol global
- Field form:
  - Nama Lengkap (validasi: tidak kosong)
  - No. WhatsApp (validasi: min 8, max 15 karakter)
  - Kelas (dropdown dari database; read-only jika dipilih dari kartu)
  - Mode (radio: Online / Offline)
  - Kode Referral (opsional)
- Validasi real-time (Zod)
- hCaptcha verification (server-side, configurable)
- Submit → generate `wa.me` URL → buka WhatsApp di tab baru → tutup modal

### 1.7 Footer
- Teks copyright yang editable via CMS

### 1.8 ISR / CMS Update
- Landing page menggunakan `revalidate = 300` (5 menit)
- Setiap update di admin dashboard memanggil `revalidatePath('/')`
- Konten editable: hero_title, hero_subtitle, hero_cta_text, footer_copyright

---

## 2. Admin Dashboard — Content (CMS)

### 2.1 Content Sections
Editable sections (per section punya tombol simpan sendiri):
- **Judul Hero** (`hero_title`) — text input
- **Subtitle Hero** (`hero_subtitle`) — textarea
- **Teks Tombol Hero** (`hero_cta_text`) — text input
- **Teks Footer** (`footer_copyright`) — text input

### 2.2 Company Photos — `/admin/content/company-photos`
- Grid view semua foto yang sudah diupload
- Upload form: file input (JPEG/PNG/WebP, max 500KB) + alt text
- Delete button per foto dengan confirm dialog
- Loading state + toast notification
- Data tabel `CompanyImage`, storage bucket `company-images`
- File: `src/app/admin/(dashboard)/content/company-photos/page.tsx`

### 2.3 Testimonials — `/admin/content/testimonials`
- Table list: Nama, Asal, Rating (stars), Status (Aktif/Nonaktif), Aksi
- Create modal: nama, asal, quote, rating (star selector), foto opsional
- Edit modal: pre-filled form, update photo (ganti atau hapus)
- Delete with confirmation
- Status toggle (tanpa reload halaman)
- Loading state + toast untuk semua aksi
- Data tabel `Testimonial`, storage bucket `testimonial-photos`
- File: `src/app/admin/(dashboard)/content/testimonials/page.tsx`

### 2.4 Save Behavior
- Save per section (bukan global)
- Inline success indicator: "Tersimpan ✓" (2 detik)
- Loading state: "Menyimpan..."

---

## 2. Admin Authentication

### 2.1 Login Page
- URL: `/admin/login`
- Form: Email + Password
- Loading spinner saat submit
- Error message: "Email atau password salah. Coba lagi ya."
- Integrasi: Supabase Auth (`signInWithPassword`)

### 2.2 Route Protection
- Middleware (`middleware.ts`) memproteksi semua `/admin/*`
- Redirect ke `/admin/login?redirect=<path>` jika tidak terautentikasi
- Session via Supabase cookie (server-side + client-side)

### 2.3 Auth Context (`use-auth.tsx`)
- React Context menyimpan state user (id, email)
- Auto-detect session saat mount
- Listen auth state changes
- Method `signOut()` → hapus session + redirect ke login

---

## 3. Admin Dashboard — Courses

### 3.1 Course List Table
- Kolom: Kursus, Harga, Pertemuan, Mode, Status, Aksi
- Badge mode: Online (blue), Offline (orange), Both (primary)
- Badge status: Aktif (green) / Nonaktif (red)
- Aksi per baris: Edit (icon pensil), Delete (icon sampah)

### 3.2 Add / Edit Course Modal
- Form fields:
  - Nama Kursus
  - Deskripsi (textarea)
  - Harga Dasar (number, Rp)
  - Diskon % (0–100, auto-convert ke 0–1 decimal)
  - Jumlah Pertemuan (number, min 1)
  - Mode (select: Online & Offline / Online / Offline)
  - Toggle Aktif/Nonaktif (switch)
- Validasi Zod real-time
- Loading state: spinner + "Menyimpan..."
- Setelah submit: reload halaman untuk refresh data

### 3.3 Delete Course
- Konfirmasi modal: "Hapus Kursus? Tindakan ini tidak dapat dibatalkan."
- Tombol konfirmasi dengan loading spinner: "Menghapus..."
- Tombol Batal disabled saat proses
- **Business Logic:** Sebelum hapus kursus:
  1. Update semua siswa yang terdaftar → `selectedCourseId = null`
  2. Hapus semua jadwal terkait
  3. Hapus kursus
- Toast: "Kursus berhasil dihapus" atau "Gagal menghapus kursus"

---

## 4. Admin Dashboard — Students

### 4.1 Student List Table
- Kolom: Nama, Kursus, Mode, Status, Referral, Aksi
- Filter bar:
  - Search (nama atau no. HP)
  - Filter Kursus (dropdown)
  - Filter Status (dropdown: Aktif / Tidak Aktif / Trial)
- Badge status: Aktif (green), Tidak Aktif (red), Trial (yellow)

### 4.2 Add / Edit Student Modal
- Form fields:
  - Nama Lengkap
  - No. WhatsApp
  - Kursus (dropdown, opsional)
  - Mode (Online / Offline)
  - Status (Aktif / Tidak Aktif / Trial)
  - Kode Referral (opsional)
  - Catatan (opsional)
- Validasi Zod + loading state

### 4.3 Delete Student
- Konfirmasi modal + loading state + toast notification

---

## 5. Admin Dashboard — Schedules

### 5.1 Calendar View (FullCalendar)
- Kalender bulanan interaktif
- Event berwarna unik per kursus (10 warna palette)
- Filter kursus (dropdown di header)
- Klik tanggal kosong → modal tambah jadwal
- Klik event → modal edit jadwal

### 5.2 Add / Edit Schedule Modal
- Form fields:
  - Kursus (dropdown)
  - No. Pertemuan (number)
  - Tanggal (date picker)
  - Waktu Mulai & Selesai (time picker, validasi end > start)
  - Zoom Link (opsional)
  - Mode (radio: Online / Offline)
  - Siswa (checkbox list dari siswa aktif)
  - Catatan (opsional)
- Validasi: semua field wajib kecuali opsional
- Tombol "Hapus" hanya muncul saat edit

### 5.3 Delete Schedule
- Konfirmasi overlay di dalam modal
- Loading state + toast notification

---

## 6. Admin Dashboard — Content (CMS)

### 6.1 Content Sections
Editable sections (per section punya tombol simpan sendiri):
- **Judul Hero** (`hero_title`) — text input
- **Subtitle Hero** (`hero_subtitle`) — textarea
- **Teks Tombol Hero** (`hero_cta_text`) — text input
- **Teks Footer** (`footer_copyright`) — text input

### 6.2 Save Behavior
- Save per section (bukan global)
- Inline success indicator: "Tersimpan ✓" (2 detik)
- Loading state: "Menyimpan..."

---

## 7. Admin Dashboard — Settings

### 7.1 WhatsApp Configuration
- No. WhatsApp Admin (wajib, format: 6281234567890)
- Template Pesan (opsional)
- Placeholder support: `{name}`, `{phone}`, `{course}`, `{mode}`
- Inline success indicator

### 7.2 Admin Profile
- Email (read-only, default: `admin@esk.id`)
- Password Baru (opsional) — input dengan `useRef`
- Konfirmasi Password — validasi cocok dengan Password Baru
- **Save behavior:**
  1. Validasi client-side (min 6 karakter, konfirmasi cocok)
  2. `supabase.auth.updateUser({ password })` — update di Supabase Auth
  3. Server action `updateAdminPasswordHash()` — update di tabel `Admin.passwordHash`
  4. Clear fields + "Tersimpan ✓" jika sukses
  5. Error dari Supabase ditampilkan langsung ke user

### 7.3 Danger Zone
- Tombol "Hapus Semua Data Siswa" dengan alert konfirmasi sederhana

---

## 8. Shared UX Patterns

### 8.1 Toast Notifications (`use-toast.ts` + `ToastContainer`)
- Posisi: fixed bottom-right
- Tipe:
  - Success → background green (`bg-green-600`)
  - Error → background red (`bg-red-600`)
  - Info → background gray (`bg-gray-800`)
- Auto-dismiss: 4 detik
- Muncul untuk: semua aksi delete sukses/gagal, error API

### 8.2 Loading States
- Semua tombol aksi punya loading state dengan spinner SVG
- Spinner menggunakan `animate-spin` Tailwind
- Tombol disabled (`disabled:opacity-60`) saat loading
- Tombol "Batal" juga disabled saat form submitting
- Delete icon di list berubah jadi spinner saat proses

### 8.3 Sidebar Active Highlight
- Menggunakan `usePathname()` dari Next.js
- Menu aktif: background `color-primary-ghost` + font bold + accent text
- Menu non-aktif: hover effect saja
- Overview (`/admin`) di-highlight hanya saat exact match

### 8.4 Cursor Pointer
- Semua `<button>` di seluruh aplikasi memiliki class `cursor-pointer`
- Hand cursor muncul saat hover

---

## 9. API Layer

### 9.1 RESTful Endpoints
Semua API routes mengembalikan JSON dengan format konsisten:
- Sukses: `{ id: string }` atau `{ success: true }`
- Error: `{ error: string }` dengan HTTP status code

### 9.2 Validation
- Semua request body divalidasi menggunakan Zod schema
- Error Zod → HTTP 400 "Data tidak valid"
- Error server → HTTP 500 dengan pesan spesifik

### 9.3 Revalidation
- Setiap mutasi (POST/PUT/DELETE) memanggil `revalidatePath('/')`
- Landing page otomatis refresh konten dalam <5 detik

---

## 10. Animated Gradient Background
- File: `src/styles/landing.css`
- CSS `@keyframes gradientShift` — slow-shift 18 detik
- Background `linear-gradient(135deg, #FFF8F0, #FFF0EC, #F5E1E4, #FFF0EC, #FFF8F0)`
- `background-size: 400% 400%` untuk smooth transition
- `prefers-reduced-motion` override: nonaktifkan animasi, fallback ke `#FFF8F0`

## 11. Scroll Animations
- Hook: `src/hooks/use-scroll-animation.ts`
- Intersection Observer API dengan `threshold: 0.1` dan `rootMargin: 0px 0px -50px 0px`
- Staggered children: delay 80ms per item via `getAnimationStyles(index * staggerDelay)`
- prefers-reduced-motion via `useSyncExternalStore` — server default true
- Transition: opacity 500ms + translateY(20px→0), ease-out

## 12. Icons
- Library: `lucide-react` v1.14.0
- Stroke width: 1.5px
- Ukuran: 20px (inline), 24-32px (dekoratif)
- Icon wrapper: background `var(--color-bg-icon)`, rounded-full
- Icon color: `var(--color-text-accent)` atau `var(--color-primary)`

## 13. Database

### 13.1 PostgreSQL (Supabase)
ORM: Drizzle ORM — schema-based types, SQL-like queries, drizzle-kit

### 13.2 Key Tables
| Table | Purpose |
|-------|---------|
| `Course` | Katalog kursus dengan harga, diskon, mode |
| `Student` | Data siswa dengan relasi ke kursus |
| `Schedule` | Jadwal pertemuan dengan relasi ke kursus |
| `ScheduleStudent` | Junction table jadwal ↔ siswa (Many-to-Many) |
| `Content` | CMS konten landing page |
| `Admin` | Data admin untuk autentikasi |
| `WhatsAppConfig` | Konfigurasi WhatsApp admin |
| `CompanyImage` | Foto perusahaan untuk landing page (url, altText, sortOrder) |
| `Testimonial` | Testimoni siswa (name, origin, quote, rating, photoUrl, isActive, sortOrder) |

### 13.3 Supabase Storage
| Bucket | Purpose | Access |
|--------|---------|--------|
| `company-images` | Foto company profile landing page | Public SELECT, Auth INSERT/DELETE |
| `testimonial-photos` | Foto testimoni siswa | Public SELECT, Auth INSERT/DELETE |

### 13.4 Cascading Behavior
- Hapus `Schedule` → hapus `ScheduleStudent` terkait (manual cascade via query)
- Hapus `Course` → manual: set `Student.selectedCourseId = null`, hapus `Schedule`, baru hapus `Course`
- Hapus `Testimonial` → hapus photo dari Storage jika ada
- Update `Testimonial` photo → hapus photo lama dari Storage sebelum upload baru

---

## 14. Bugfixes & Improvements

| ID | Deskripsi | File Terkait | Tanggal |
|----|-----------|--------------|---------|
| [BF-001](bugfixes/BF-001-course-deletion-foreign-key.md) | Fix: tidak bisa menghapus course karena foreign key constraint | `api/courses/[id]/route.ts` | 2026-05-09 |
| [BF-002](bugfixes/BF-002-toast-notifications.md) | Tambah toast notification untuk semua aksi delete | `hooks/use-toast.ts`, `components/ui/toast-container.tsx`, 3 admin pages | 2026-05-09 |
| [BF-003](bugfixes/BF-003-loading-states.md) | Tambah loading state pada semua tombol aksi CRUD | 3 admin pages | 2026-05-09 |
| [BF-004](bugfixes/BF-004-sidebar-active-highlight.md) | Tambah highlight menu aktif di sidebar admin | `components/admin/admin-sidebar.tsx` | 2026-05-09 |
| [BF-005](bugfixes/BF-005-cursor-pointer.md) | Tambah cursor pointer pada semua elemen button | 8+ files | 2026-05-09 |
| [BF-006](bugfixes/BF-006-password-update.md) | Fix: password update tidak berfungsi di halaman Settings | `settings/page.tsx`, `auth-actions.ts` | 2026-05-10 |
| BF-007 | Fix: sortOrder query ambil MIN bukan MAX saat upload baru | `company-image-actions.ts:50`, `testimonial-actions.ts:72` | 2026-05-10 |
| BF-008 | Fix: orphaned photo tidak dihapus dari Storage saat update testimoni | `testimonial-actions.ts` | 2026-05-10 |
| BF-009 | Fix: SSR hydration flash pada scroll animations | `hooks/use-scroll-animation.ts` | 2026-05-10 |
| BF-010 | Fix: carousel crash saat array testimoni mengecil | `testimony-carousel.tsx` | 2026-05-10 |
| BF-011 | Fix: storage RLS policies tidak adaebabkan gambar 403 | `run setup endpoint` | 2026-05-10 |
| BF-012 | Fix: `next/image` hostname not configured untuk Supabase Storage | `next.config.ts` | 2026-05-10 |

---

*End of Feature Overview*
