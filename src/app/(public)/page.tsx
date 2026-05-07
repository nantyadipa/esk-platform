import Link from 'next/link'

export default function LandingPage() {
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
          Belajar English Tanpa Ribet
        </h2>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
          Pilih kelas, isi form, langsung terhubung ke admin via WhatsApp. Tanpa perlu bertanya-tanya.
        </p>
        <Link
          href="#harga-kelas"
          data-testid="hero-cta"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-full text-base font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-cta-lg)] hover:-translate-y-0.5 transition-all"
        >
          Daftar Sekarang
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section id="harga-kelas" data-testid="courses-section" className="max-w-[1100px] mx-auto px-6 py-12">
        <h3 className="font-display font-bold text-2xl text-[var(--color-text-primary)] mb-8 text-center">
          Harga & Kelas
        </h3>
        <p className="text-center text-[var(--color-text-secondary)] mb-8">
          Kelas akan dimuat dari database. Ini adalah placeholder.
        </p>
      </section>

      <footer data-testid="footer" className="border-t border-[var(--color-border)] mt-16 py-8">
        <div className="max-w-[1100px] mx-auto px-6 text-center text-sm text-[var(--color-text-secondary)]">
          <p>&copy; 2026 English Sepulang Kerja. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}