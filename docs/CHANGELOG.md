# Changelog — ESK Platform

**Project:** English Sepulang Kerja (ESK)
**Repository:** `github.com/nantyadipa/esk-platform`

---

## 2026-05-10 — Landing Page Revamp (v2.1.0)

### Commits
| Hash | Message |
|------|---------|
| `3bace55` | feat: landing page revamp with animated gradient, company profile, testimony carousel, and admin CMS |
| `50a658f` | Merge PR #1: same feature (squashed to development) |
| `88cb4f8` | feat: add setup API route for storage buckets and RLS policies |
| `62b4dd5` | fix: use service role key for setup API route |
| `15dbbe3` | chore: add .env.production to gitignore, update Vercel production env |

### Added

#### Landing Page
- **Animated Gradient Background** — slow-shift animasi 18 detik antara warna brand (Cream, Warm Blush, Light Rose) sebagai pengganti solid color `#FFF8F0`
- **Hero Section Revamp** — decorative Lucide icons (GraduationCap, BookOpen, Sparkles) di background, staggered entrance animation untuk judul, subtitle, dan CTA
- **Company Profile ("Tentang ESK")** — multi-section layout:
  - Teks profil perusahaan (hardcoded)
  - Galeri foto dari database (admin upload via Supabase Storage bucket `company-images`)
  - 4 value proposition cards dengan Lucide icons (CalendarClock, Award, BadgePercent, FileCheck)
- **Testimony Section ("Apa Kata Mereka")** — Embla Carousel dengan:
  - Autoplay 4 detik, infinite loop, smooth slide transition
  - Pause on hover, keyboard navigation
  - Jika ≤ 3 testimoni: tampil sebagai static grid (semua visible)
  - Jika > 3 testimoni: carousel mode
  - Dots indicator synced dengan slide aktif via React state
- **Pricing Section Revamp** — featured card styling (border + shadow berbeda untuk kursus pertama), Lucide icons per mode (Monitor/Users/Globe), staggered entrance animation

#### Admin CMS
- **Foto Company** (`/admin/content/company-photos`) — upload/delete foto ke Supabase Storage, grid view, alt text, validasi 500KB limit
- **Testimoni** (`/admin/content/testimonials`) — full CRUD: create/edit modal, delete confirmation, toggle status aktif/nonaktif, star rating selector, optional photo upload

#### Infrastructure
- **Database tables**: `CompanyImage` (url, altText, sortOrder), `Testimonial` (name, origin, quote, rating, photoUrl, isActive, sortOrder)
- **Supabase Storage buckets**: `company-images` (public), `testimonial-photos` (public)
- **RLS policies**: 6 policies untuk SELECT public + INSERT/DELETE authenticated pada storage.objects
- **API routes**: `GET /api/company-images`, `GET /api/testimonials`, `GET /api/setup`
- **Server actions**: `uploadCompanyImage`, `deleteCompanyImage`, `createTestimonial`, `updateTestimonial`, `deleteTestimonial`, `toggleTestimonialStatus`

#### Animations & UX
- **useScrollAnimation hook** — Intersection Observer-based scroll-triggered animations dengan prefers-reduced-motion respect
- **@keyframes slideInRight/slideInLeft** — smooth horizontal slide untuk carousel
- **Button hover effects** — scale(1.02) + shadow-lg + translateY(-2px) di semua tombol interaktif
- **Navbar** — sticky header dengan backdrop blur, link "Tentang" di navigasi

### Changed
- `next.config.ts` — added `images.remotePatterns` untuk Supabase Storage hostname
- `src/app/page.tsx` — full rewrite: animated gradient, new sections, parallel data fetching
- `src/components/landing/landing-client.tsx` — animated pricing header, staggered cards
- `src/components/landing/course-card.tsx` — Lucide icons, featured card, scale hover
- `src/components/admin/admin-sidebar.tsx` — added Foto Company & Testimoni menu items
- `src/db/schema.ts` — added CompanyImage + Testimonial tables
- `src/types/index.ts` — added CompanyImage + Testimonial type exports
- `src/app/globals.css` — imported landing.css
- All `<Image>` from `next/image` replaced with `<img>` for Supabase Storage URLs (next/image optimization incompatible)

### Fixed
- **sortOrder bug** — company-image-actions.ts & testimonial-actions.ts: query returned MIN instead of MAX
- **Orphaned photo on update** — testimonial-actions.ts: delete old photo from Storage before uploading new one
- **SSR hydration flash** — useScrollAnimation: replaced `setHydrated` in useEffect with `useSyncExternalStore` pattern
- **Carousel crash when array shrinks** — derived `safeCurrent` state
- **Carousel dots not updating** — replaced static `emblaApi?.selectedScrollSnap()` with React state + `onSelect` event listener
- **Autoplay stops after manual interaction** — changed `stopOnInteraction: true` to `false`
- **`typeof Monitor` type** — changed to `React.ComponentType<...>` in course-card.tsx
- **Storage RLS** — added 6 RLS policies to fix 403 on image access
- **`next/image` hostname** — added remotePatterns config (later replaced with `<img>` for storage URLs)

### Removed
- `flyonui` — replaced with `embla-carousel-react` (Tailwind v4 compatibility)

### Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `embla-carousel-react` | 8.6.0 | Testimonial carousel |
| `embla-carousel-autoplay` | 8.6.0 | Autoplay plugin for carousel |

---

## 2026-05-09 — Bugfixes & Documentation

### Commits
- `81f642d` — docs: update project documentation and add password update bugfix
- `85f7789` — fix: wire password update in admin settings
- `56eec1c` — fix: wire password update in admin settings

### Added
- BF-006: Password update fix untuk halaman Settings
- Toast notification pattern (BF-002)
- Loading states pattern (BF-003)
- Sidebar active highlight pattern (BF-004)
- Cursor pointer pattern (BF-005)
- Documentation for Bugfixes

### Fixed
- Password update di Settings tidak sinkron antara Supabase Auth dan tabel admins
- Foreign key constraint gagal saat hapus course (BF-001)

---

## 2026-05-07 — Initial Implementation (v2.0.0)

### Commits
- `969fada` — feat: migrasi ORM Prisma ke Drizzle + landing page SEO + code review fixes
- `168125a` — docs: add project documentation from root repo
- `62e68ca` — feat: initial esk-platform implementation

### Added
- Landing page (Hero, Course Listing, Registration Form, Footer)
- Admin dashboard (Courses, Students, Schedules CRUD)
- Content CMS (hero_title, hero_subtitle, hero_cta_text, footer_copyright)
- Admin authentication (Supabase Auth + middleware)
- WhatsApp integration (wa.me URL generation)
- PostgreSQL database with Drizzle ORM (Course, Student, Schedule, ScheduleStudent, Content, Admin, WhatsAppConfig)
- Supabase Auth untuk admin login
- FullCalendar integration untuk jadwal
- hCaptcha spam protection
- Design tokens system (CSS variables)
- E2E testing with Playwright + pytest
- Vercel deployment configuration
