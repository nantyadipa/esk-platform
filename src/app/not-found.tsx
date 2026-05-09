import Link from 'next/link'

export default function NotFound() {
  return (
    <div data-testid="not-found" className="min-h-screen flex items-center justify-center bg-[var(--color-bg-page)]">
      <div className="text-center">
        <h1 className="font-display font-bold text-6xl text-[var(--color-primary)] mb-4">404</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Halaman tidak ditemukan.
        </p>
        <Link
          href="/"
          data-testid="not-found-home-link"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-full font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}