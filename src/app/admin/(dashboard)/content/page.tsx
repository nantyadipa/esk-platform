'use client'

import { useState, useEffect } from 'react'

type Content = {
  id: string
  section: string
  content: string
  imageUrl: string | null
}

type SectionMeta = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'url'
  placeholder: Record<string, string>
}

const SECTIONS: SectionMeta[] = [
  {
    key: 'hero_title',
    label: 'Judul Hero',
    type: 'text',
    placeholder: { label: 'Masukkan judul hero', hint: 'Contoh: Belajar English Tanpa Ribet' },
  },
  {
    key: 'hero_subtitle',
    label: 'Subtitle Hero',
    type: 'textarea',
    placeholder: { label: 'Masukkan subtitle', hint: 'Pilih kelas, isi form, langsung terhubung...' },
  },
  {
    key: 'hero_cta_text',
    label: 'Teks Tombol Hero',
    type: 'text',
    placeholder: { label: 'Teks tombol utama', hint: 'Contoh: Daftar Sekarang' },
  },
  {
    key: 'footer_copyright',
    label: 'Teks Footer',
    type: 'text',
    placeholder: { label: 'Teks copyright', hint: 'Contoh: © 2026 English Sepulang Kerja' },
  },
]

export default function AdminContentPage() {
  const [contents, setContents] = useState<Record<string, string>>({})
  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    async function loadContent() {
      try {
        const res = await fetch('/api/content')
        const data = await res.json()
        if (!ignore) {
          const map: Record<string, string> = {}
          const urls: Record<string, string | null> = {}
          data.forEach((item: Content) => {
            map[item.section] = item.content
            urls[item.section] = item.imageUrl
          })
          setContents(map)
          setImageUrls(urls)
        }
      } catch {
        if (!ignore) setError('Gagal memuat konten')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadContent()
    return () => { ignore = true }
  }, [])

  const handleSave = async (section: string) => {
    setSaving(section)
    setSaved(null)
    setError(null)
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contents[section] || '',
          imageUrl: imageUrls[section] ?? null,
        }),
      })
      if (!res.ok) throw new Error('Gagal menyimpan')
      setSaved(section)
      setTimeout(() => setSaved(null), 2000)
    } catch {
      setError('Gagal menyimpan. Coba lagi.')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
        <p className="mt-2 text-[var(--color-text-secondary)]">Memuat...</p>
      </div>
    )
  }

  return (
    <div data-testid="admin-content">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
            Kelola Konten
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Edit konten halaman landing page.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div
            key={section.key}
            className="bg-white rounded-2xl border border-[var(--color-border)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
                {section.label}
              </label>
              <div className="flex items-center gap-2">
                {saved === section.key && (
                  <span className="text-xs text-[var(--color-success-dark)] font-medium">
                    Tersimpan ✓
                  </span>
                )}
                <button
                  onClick={() => handleSave(section.key)}
                  disabled={saving !== null}
                  className="px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {saving === section.key ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>

            {section.type === 'textarea' ? (
              <textarea
                value={contents[section.key] || ''}
                onChange={(e) => setContents({ ...contents, [section.key]: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                placeholder={section.placeholder.hint}
              />
            ) : (
              <input
                type="text"
                value={contents[section.key] || ''}
                onChange={(e) => setContents({ ...contents, [section.key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder={section.placeholder.hint}
              />
            )}

            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              {section.placeholder.label}: <span className="text-[var(--color-text-secondary)]">{section.placeholder.hint}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}