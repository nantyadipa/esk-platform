import Link from 'next/link'
import { GraduationCap, Sparkles, BookOpen } from 'lucide-react'
import { getActiveCourses, getAllContent } from '@/lib/actions/course-actions'
import { getCompanyImages } from '@/lib/actions/company-image-actions'
import { getActiveTestimonials } from '@/lib/actions/testimonial-actions'
import { LandingClient } from '@/components/landing/landing-client'
import { CompanyProfile } from '@/components/landing/company-profile'
import { TestimonyCarousel } from '@/components/landing/testimony-carousel'

export const revalidate = 300

const DEFAULT_CONTENT: Record<string, string> = {
  hero_title: 'Belajar English Tanpa Ribet',
  hero_subtitle: 'Pilih kelas, isi form, langsung terhubung ke admin via WhatsApp. Tanpa perlu bertanya-tanya.',
  hero_cta_text: 'Daftar Sekarang',
  footer_copyright: '© 2026 English Sepulang Kerja. All rights reserved.',
}

export default async function LandingPage() {
  const [courses, contentRecords, companyImages, activeTestimonials] = await Promise.all([
    getActiveCourses(),
    getAllContent(),
    getCompanyImages(),
    getActiveTestimonials(),
  ])

  const content = { ...DEFAULT_CONTENT, ...contentRecords }

  return (
    <main data-testid="landing-page" className="min-h-screen animated-gradient-bg">
      <nav data-testid="nav-header" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              data-testid="logo-mark"
              className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center"
            >
              <span className="text-white font-bold text-xs font-display">ESK</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-[var(--color-text-primary)] text-sm leading-tight">
                English Sepulang Kerja
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Jadwal Rapi, Mengajar Tenang
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#tentang-esk"
              data-testid="nav-about"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors hidden sm:block"
            >
              Tentang
            </a>
            <Link
              href="#harga-kelas"
              data-testid="nav-cta"
              className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all"
            >
              Lihat Kelas
            </Link>
          </div>
        </div>
      </nav>

      <section data-testid="hero-section" className="relative max-w-[1100px] mx-auto px-6 py-20 md:py-28 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="absolute inset-0 pointer-events-none select-none">
          <GraduationCap className="absolute top-10 left-[10%] w-20 h-20 text-[var(--color-primary)] opacity-[0.06]" strokeWidth={1} />
          <BookOpen className="absolute top-20 right-[15%] w-28 h-28 text-[var(--color-primary)] opacity-[0.05]" strokeWidth={1} />
          <Sparkles className="absolute bottom-10 left-[20%] w-16 h-16 text-[var(--color-primary)] opacity-[0.04]" strokeWidth={1} />
          <Sparkles className="absolute top-5 right-[30%] w-10 h-10 text-[var(--color-primary)] opacity-[0.03]" strokeWidth={1} />
        </div>

        <div className="relative flex-1 text-center lg:text-left">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] mb-4 animate-fade-slide-up">
            {content.hero_title}
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-xl mb-8 leading-relaxed font-medium animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
            {content.hero_subtitle}
          </p>
          <div className="animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="#harga-kelas"
              data-testid="hero-cta"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full text-base font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-cta-lg)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all"
            >
              {content.hero_cta_text}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="relative flex-1 hidden lg:flex items-center justify-center animate-fade-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-primary-lighter)] to-[var(--color-primary-ghost)] opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-4 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--color-border)] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-3 shadow-[0_4px_20px_rgba(183,110,121,0.3)]">
                  <span className="text-white font-bold text-xl font-display">ESK</span>
                </div>
                <p className="font-display font-bold text-[var(--color-text-primary)] text-sm">English Sepulang Kerja</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">Jadwal Rapi, Mengajar Tenang</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CompanyProfile images={companyImages} />

      <LandingClient courses={courses} />

      <TestimonyCarousel testimonials={activeTestimonials} />

      <footer data-testid="footer" className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-[1100px] mx-auto px-6 text-center text-sm text-[var(--color-text-secondary)] pb-16 md:pb-8">
          <p>{content.footer_copyright}</p>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t border-[var(--color-border)] md:hidden">
        <a
          href="#harga-kelas"
          data-testid="btn-sticky-cta"
          className="block w-full text-center bg-[var(--color-primary)] text-white px-6 py-3.5 rounded-full text-base font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all"
        >
          Daftar Sekarang &rarr;
        </a>
      </div>
    </main>
  )
}
