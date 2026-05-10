import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'English Sepulang Kerja — Belajar Bahasa Inggris dengan Mudah',
  description: 'Platform les bahasa Inggris dengan pendaftaran instan via WhatsApp. Pilih kelas, isi form, langsung terhubung ke admin.',
  keywords: ['bahasa inggris', 'kursus', 'les', 'online', 'TOEFL', 'IELTS', 'pendaftaran'],
  metadataBase: new URL('https://englishsepulangkerja.com'),
  openGraph: {
    title: 'English Sepulang Kerja',
    description: 'Belajar bahasa Inggris dengan mudah. Daftar langsung via WhatsApp.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'English Sepulang Kerja',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English Sepulang Kerja',
    description: 'Belajar bahasa Inggris dengan mudah. Daftar langsung via WhatsApp.',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="bg-[var(--color-bg-page)] text-[var(--color-text-primary)] font-body antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'English Sepulang Kerja',
              description: 'Les bahasa Inggris dengan pendaftaran instan via WhatsApp.',
              url: 'https://englishsepulangkerja.com',
              telephone: '+6281234567890',
              address: { '@type': 'PostalAddress', addressCountry: 'ID' },
              sameAs: ['https://instagram.com/englishsepulangkerja'],
            }),
          }}
        />
      </body>
    </html>
  )
}