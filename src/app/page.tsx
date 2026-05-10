import Link from 'next/link'
import { getActiveCourses, getAllContent } from '@/lib/actions/course-actions'
import { LandingClient } from '@/components/landing/landing-client'

export const revalidate = 300

const DEFAULT_CONTENT: Record<string, string> = {
  hero_title: 'Belajar English Tanpa Ribet',
  hero_subtitle: 'Pilih kelas, isi form, langsung terhubung ke admin via WhatsApp. Tanpa perlu bertanya-tanya.',
  hero_cta_text: 'Daftar Sekarang',
  footer_copyright: '© 2026 English Sepulang Kerja. All rights reserved.',
}

export default async function LandingPage() {
  const [courses, contentRecords] = await Promise.all([
    getActiveCourses(),
    getAllContent(),
  ])

  const content = { ...DEFAULT_CONTENT, ...contentRecords }

  return (
    <main data-testid="landing-page" className="min-h-screen bg-[var(--color-bg-page)]">
      <nav data-testid="nav-header" className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[var(--color-border)]">
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
          <Link
            href="#harga-kelas"
            data-testid="nav-cta"
            className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all"
          >
            Lihat Kelas
          </Link>
        </div>
      </nav>

      <section data-testid="hero-section" className="max-w-[1100px] mx-auto px-6 py-16 text-center">
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--color-text-primary)] mb-4">
          {content.hero_title}
        </h2>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
          {content.hero_subtitle}
        </p>
        <Link
          href="#harga-kelas"
          data-testid="hero-cta"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full text-base font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-cta-lg)] hover:-translate-y-0.5 transition-all"
        >
          {content.hero_cta_text}
          <span aria-hidden="true">&#8594;</span>
        </Link>
      </section>

      <LandingClient courses={courses} />

      <footer data-testid="footer" className="border-t border-[var(--color-border)] mt-16 py-8">
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