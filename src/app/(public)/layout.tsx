import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'English Sepulang Kerja',
  description: 'Belajar bahasa Inggris dengan mudah. Daftar langsung via WhatsApp.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="public-layout">
      {children}
    </div>
  )
}