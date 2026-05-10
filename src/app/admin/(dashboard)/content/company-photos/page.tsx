'use client'

import { useState, useEffect } from 'react'
import { Trash2, Upload } from 'lucide-react'
import { uploadCompanyImage, deleteCompanyImage } from '@/lib/actions/company-image-actions'
import type { CompanyImage } from '@/types'

export default function AdminCompanyPhotosPage() {
  const [images, setImages] = useState<CompanyImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    fetch('/api/company-images')
      .then((res) => res.json())
      .then((data) => { if (!ignore) setImages(data) })
      .catch(() => { if (!ignore) setError('Gagal memuat foto.') })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [])

  const reloadImages = () => {
    fetch('/api/company-images')
      .then((res) => res.json())
      .then(setImages)
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setUploading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      setError('Pilih file gambar terlebih dahulu.')
      setUploading(false)
      return
    }

    const result = await uploadCompanyImage(formData)
    if (result.success) {
      setSuccess('Foto berhasil diupload!')
      form.reset()
      reloadImages()
    } else {
      setError(result.error || 'Gagal upload.')
    }
    setUploading(false)
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus foto ini?')) return
    setDeleting(id)
    setError(null)
    const result = await deleteCompanyImage(id)
    if (result.success) {
      setImages((prev) => prev.filter((img) => img.id !== id))
    } else {
      setError(result.error || 'Gagal menghapus.')
    }
    setDeleting(null)
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
    <div data-testid="admin-company-photos">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
            Foto Company
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Kelola foto perusahaan untuk landing page.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--color-success)]/30 text-[var(--color-success-dark)] text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleUpload} className="mb-8 p-6 bg-white rounded-2xl border border-[var(--color-border)]">
        <h2 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-4">
          Upload Foto Baru
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp"
              data-testid="company-photo-file"
              className="w-full text-sm text-[var(--color-text-secondary)] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white file:cursor-pointer hover:file:bg-[var(--color-primary-dark)]"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="altText"
              placeholder="Deskripsi singkat foto"
              data-testid="company-photo-alt"
              className="w-full px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            data-testid="company-photo-upload-btn"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" strokeWidth={1.5} />
            {uploading ? 'Mengupload...' : 'Upload'}
          </button>
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          Format: JPEG, PNG, WebP. Maksimum 500KB.
        </p>
      </form>

      {images.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)]">Belum ada foto. Upload foto pertama!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              data-testid={`company-photo-item-${img.id}`}
              className="relative group rounded-[16px] overflow-hidden border border-[var(--color-border)] bg-white"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={img.url}
                  alt={img.altText}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-2 flex items-center justify-between">
                <p className="text-xs text-[var(--color-text-secondary)] truncate flex-1 mr-2">
                  {img.altText}
                </p>
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deleting === img.id}
                  data-testid={`company-photo-delete-${img.id}`}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-error-dark)] transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
                  aria-label="Hapus foto"
                >
                  {deleting === img.id ? (
                    <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
