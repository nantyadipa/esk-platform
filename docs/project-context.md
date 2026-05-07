---
project_name: 'SpecDrivenDevelopment'
user_name: 'Anan TLab'
date: '2026-05-08'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 47
optimized_for_llm: true
---

# Project Context for AI Agents — English Sepulang Kerja (ESK)

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Next.js | 14.x (App Router) | Monolith: SSR/SSG + API Routes + Server Actions |
| React | 18.x | UI library (bundled dengan Next.js 14) |
| TypeScript | 5.x | Strict mode WAJIB |
| Prisma | Latest stable | ORM, type-safe queries, migrations |
| Supabase | Latest stable | PostgreSQL + Auth + Storage + Realtime + RLS |
| FullCalendar | React latest | Calendar view admin dashboard |
| Playwright | Latest stable | E2E testing framework |
| pytest | Latest stable | Python test runner untuk Playwright |
| hCaptcha | Latest | Spam prevention di form |
| Lucide React | Latest | Icon library (outline style only, stroke 1.5px) |
| Plus Jakarta Sans | Google Fonts | Display/heading font (600, 700, 800) |
| Inter | Google Fonts | Body/UI font (400, 500, 600) |
| JetBrains Mono | Google Fonts | Monospace font (jika perlu) |
| Vercel | Latest | Deployment platform, zero-config CI/CD |

**Key Dependencies:**
- Supabase Client SDK — auth, storage, realtime
- Prisma Client — generated types, database queries
- `wa.me` URL scheme — bukan API, hanya URL generation
- Rich text editor — TBD (dipilih saat implementation)

---

## Critical Implementation Rules

### Language-Specific Rules

- TypeScript strict mode WAJIB (`"strict": true` di `tsconfig.json`) — no implicit any, strict null checks
- Semua komponen React WAJIB `.tsx`, bukan `.jsx`
- Type-safe Prisma queries: gunakan generated Prisma Client types, JANGAN hardcode type definitions duplikat
- Database: `decimal` untuk harga (beware floating point), `enum` Prisma untuk status/kategori
- Error handling: gunakan `Result<T, E>` pattern atau try-catch di Server Actions, JANGAN biarkan error silently fail
- WhatsApp URL: `encodeURIComponent` untuk setiap field — generate di server side
- Discount: `final_price = base_price * (1 - discount_rate)` — hitung di server side, JANGAN client-only
- Currency formatting: SELALU `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })` — JANGAN manual concatenation
- Error messages UI: Bahasa Indonesia sesuai PRD microcopy — "Ada yang salah. Coba lagi ya." BUKAN "Error 500"

### Framework-Specific Rules

- **Routing convention:**
  - Landing page: `app/(public)/` — NO auth required
  - Admin dashboard: `app/(admin)/` — auth middleware required
  - API routes: `app/api/` — RESTful endpoints untuk CRUD
- **Data fetching:**
  - Landing page: Server Components + `revalidate` (ISR) atau `revalidatePath` on-demand setelah CMS update
  - Admin dashboard: Server Actions untuk mutations, Client Components hanya untuk interactivity
  - JANGAN fetch data di Client Components untuk landing page konten
- **Authentication:**
  - Supabase Auth untuk admin login (single user MVP)
  - `middleware.ts`: protect `/admin/*` routes, redirect ke login jika unauthenticated
  - Session-based (Supabase session cookie)
- **CMS update flow:** Admin save → Server Action update DB → `revalidatePath('/')` → landing page update <5 detik
- **Image optimization:** `next/image` dengan `sizes` prop, WAJIB `priority` untuk hero image
- **hCaptcha:** load di Client Component, JANGAN di Server Component
- **WhatsApp URL:** generate di Server Action, JANGAN di client — prevent tampering
- **Form:** Client Component untuk interactivity, validation juga di server side — NEVER trust client-only

### Testing Rules

- **Testing framework:** Playwright + Python pytest — E2E testing ONLY (no Vitest/RTL untuk MVP)
- **data-testid:** SEMUA elemen frontend WAJIB `data-testid` attribute — tidak boleh selector berdasarkan CSS class, ID, atau text content
- **Page Object Model (POM):** WAJIB — semua selector dan actions dienkapsulasi dalam Page Object classes
  - Struktur: `tests/pages/` untuk Page Objects, `tests/tests/` untuk test files
  - Setiap page punya 1 Page Object class
  - Selector: `page.locator('[data-testid="course-name"]')` — SELALU via data-testid
  - Method: verb-noun (`click_submit_button`, `fill_name_field`, `get_course_price`)
  - Test files: HANYA gunakan Page Object methods, JANGAN langsung `page.locator()` di test
- **E2E test priority:**
  - Landing page → form fill → WhatsApp link generation (full user journey)
  - Admin login → CRUD course → verify landing page update
  - Admin schedule CRUD → calendar view rendering
  - Unauthenticated access `/admin/*` → redirect ke login
  - Discount display (strikethrough + final price, edge case 0% dan 100%)
  - hCaptcha presence (bypass untuk testing)
- **Test database:** Supabase branch atau seeded test DB, JANGAN production data
- **Coverage:** ≥80% utility functions, ≥60% overall (landing page critical path)

### Code Quality & Style Rules

- **Naming conventions:**
  - Files/folders: kebab-case (`course-card.tsx`, `admin-layout.tsx`)
  - React components: PascalCase (`CourseCard`, `AdminLayout`)
  - Hooks: camelCase + `use` prefix (`useCourseList`, `useAuth`)
  - Server Actions: camelCase + verb prefix (`createCourse`, `updateSchedule`, `deleteStudent`)
  - Prisma models: PascalCase singular (`Course`, `Student`, `Schedule`)
  - DB columns: snake_case (`base_price`, `discount_rate`, `created_at`)
  - data-testid: kebab-case + context (`course-card-price`, `admin-btn-save`, `schedule-slot-time`)
- **File/folder structure:**
  ```
  app/
    (public)/            # Landing page (NO auth)
    (admin)/             # Dashboard (auth required)
      courses/
      students/
      schedules/
      content/
      settings/
    api/                 # API routes jika diperlukan
  components/
    ui/                  # Shared UI primitives (Button, Card, Input)
    landing/             # Landing page components
    admin/               # Admin dashboard components
  lib/
    db.ts               # Prisma client singleton
    auth.ts             # Supabase auth helpers
    whatsapp.ts         # WhatsApp URL generator
    utils.ts            # Formatting helpers (currency, date)
  styles/
    globals.css         # Design tokens import + base styles
    landing.css         # Landing-specific styles
    admin.css           # Admin-specific styles
  ```
- **Import convention:** `@/` path alias, JANGAN `../../../` relative paths
- **Comments:** JANGAN tambahkan kecuali diminta — kode self-documenting via naming
- **Design tokens:** SELALU import dari `docs/design-tokens.css` atau CSS variables — JANGAN hardcode warna/spacing/font

### Development Workflow Rules

- **Branch naming:** `feature/<singkat>`, `fix/<singkat>`, `chore/<singkat>` — contoh: `feature/course-crud`
- **Commit messages:** Conventional Commits dalam Bahasa Indonesia — `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `test:`, `ci:`
  - Contoh: `feat: tambah form pendaftaran dengan WhatsApp integration`
- **Deployment:**
  - Push `main` = deploy otomatis ke Vercel (production)
  - Push `staging` = deploy ke Vercel preview branch
  - WAJIB E2E test pass sebelum merge ke main
- **Env variables:**
  - `.env.local` untuk development (JANGAN commit)
  - `.env.example` WAJIB di commit dengan placeholder values
  - Supabase URL, anon key, redirect URL di environment variables
- **Database workflow:**
  - Edit `schema.prisma` → `npx prisma migrate dev` → `npx prisma generate`
  - JANGAN edit DB secara manual (SQL) kecuali emergency
  - Migration WAJIB di-review sebelum deploy ke production

### Critical Don't-Miss Rules

**Anti-Patterns (JANGAN lakukan):**

- ❌ Simpan data form pendaftaran ke DB otomatis — form HANYA generate WhatsApp message, admin input manual
- ❌ Buat dark mode — MVP light mode saja (Cream #FFF8F0 background)
- ❌ Gunakan gray-based shadows — SELALU Rose Gold tint `rgba(183,110,121,x)`
- ❌ Calc discount di client-side saja — WAJIB server-side juga
- ❌ Hardcode harga di komponen — SELALU dari database via CMS
- ❌ Buat separate backend — monolith Next.js dulu, extract nanti kalau perlu
- ❌ Gunakan Plus Jakarta Sans di bawah 16px — font body untuk ukuran kecil
- ❌ Campur Plus Jakarta Sans dan Inter dalam satu text node
- ❌ Border-radius di bawah 12px untuk cards — minimum 16px
- ❌ Generate WhatsApp URL di client-side untuk form — risiko tampering

**Edge Cases (WAJIB handle):**

- `discount_rate = 0` → tampilkan base_price saja, TANPA strikethrough dan final_price
- `discount_rate = 1` (100%) → tampilkan "Gratis" atau "Rp0" — JANGAN `~~Rp500.000~~ Rp0`
- Schedule conflict → system WAJIB reject jika instruktur bentrok waktu sama
- Image upload >500KB → error: "Ukuran file terlalu besar. Maksimum 500KB."
- hCaptcha failure → WAJIB fallback accessible (audio challenge atau form biasa)
- Mobile viewport 320px → SEMUA konten dan interactive element harus usable
- `prefers-reduced-motion` → WAJIB disable semua animasi (sudah ada di design tokens)

**Security Rules:**

- Admin dashboard routes WAJIB authenticated — middleware check setiap request
- Landing page routes WAJIB public (no auth)
- Form validation WAJIB client-side DAN server-side — NEVER trust client-only
- hCaptcha WAJIB di form pendaftaran — rate limiting di server side
- JANGAN sertakan data sensitif (password, payment) di WhatsApp message payload

**Performance Gotchas:**

- Landing page LCP <2 detik — WAJIB `next/image` + `priority` untuk hero image
- CMS update → landing page update <5 detik — gunakan `revalidatePath` atau ISR
- Calendar view interaction <500ms — client-side state, JANGAN refetch seluruh data per view switch
- Mobile 3G → above-fold content <8 detik — lazy load komponen di bawah fold

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-05-08