'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, Star, X } from 'lucide-react'
import { createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonialStatus } from '@/lib/actions/testimonial-actions'
import type { Testimonial } from '@/types'

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="cursor-pointer"
        >
          <Star
            className={`w-5 h-5 ${star <= value ? 'text-[#F4C4A6] fill-[#F4C4A6]' : 'text-[var(--color-border)]'}`}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}

type ModalData = {
  name: string
  origin: string
  quote: string
  rating: number
  isActive: boolean
}

const emptyForm: ModalData = { name: '', origin: '', quote: '', rating: 5, isActive: true }

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ModalData>(emptyForm)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let ignore = false
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => { if (!ignore) setTestimonials(data) })
      .catch(() => { if (!ignore) setError('Gagal memuat testimoni.') })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [])

  const reloadTestimonials = () => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then(setTestimonials)
  }

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (showModal && modalRef.current) {
      const firstInput = modalRef.current.querySelector('input, button') as HTMLElement | null
      firstInput?.focus()
    }
  }, [showModal])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setPhotoFile(null)
    setRemovePhoto(false)
    setShowModal(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id)
    setForm({ name: t.name, origin: t.origin, quote: t.quote, rating: t.rating, isActive: t.isActive })
    setPhotoFile(null)
    setRemovePhoto(false)
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('origin', form.origin)
    formData.append('quote', form.quote)
    formData.append('rating', String(form.rating))
    formData.append('isActive', String(form.isActive))
    if (removePhoto) formData.append('removePhoto', 'true')
    if (photoFile) formData.append('photo', photoFile)

    const result = editingId
      ? await updateTestimonial(editingId, formData)
      : await createTestimonial(formData)

    if (result.success) {
      setSuccess(editingId ? 'Testimoni diperbarui!' : 'Testimoni dibuat!')
      setShowModal(false)
      reloadTestimonials()
    } else {
      setError(result.error || 'Gagal menyimpan.')
    }
    setSaving(false)
    if (successTimerRef.current) clearTimeout(successTimerRef.current)
    successTimerRef.current = setTimeout(() => setSuccess(null), 3000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return
    setDeleting(id)
    const result = await deleteTestimonial(id)
    if (result.success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } else {
      setError(result.error || 'Gagal menghapus.')
    }
    setDeleting(null)
  }

  const handleToggle = async (id: string) => {
    setToggling(id)
    const result = await toggleTestimonialStatus(id)
    if (result.success) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
      )
    } else {
      setError(result.error || 'Gagal mengubah status.')
    }
    setToggling(null)
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
    <div data-testid="admin-testimonials">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
            Testimoni
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Kelola testimoni siswa untuk landing page.
          </p>
        </div>
        <button
          onClick={openCreate}
          data-testid="testimonial-add-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Tambah Testimoni
        </button>
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

      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)]">Belum ada testimoni.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm" data-testid="testimonials-table">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left">
                <th className="p-4 font-semibold text-[var(--color-text-primary)]">Nama</th>
                <th className="p-4 font-semibold text-[var(--color-text-primary)]">Asal</th>
                <th className="p-4 font-semibold text-[var(--color-text-primary)]">Rating</th>
                <th className="p-4 font-semibold text-[var(--color-text-primary)]">Status</th>
                <th className="p-4 font-semibold text-[var(--color-text-primary)]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-b border-[var(--color-border-subtle)] last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {t.photoUrl ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img src={t.photoUrl} alt={t.name} className="object-cover w-full h-full" loading="lazy" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--color-bg-icon)] flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[var(--color-text-accent)]">{t.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="font-medium text-[var(--color-text-primary)]">{t.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--color-text-secondary)]">{t.origin}</td>
                  <td className="p-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < t.rating ? 'text-[#F4C4A6] fill-[#F4C4A6]' : 'text-[var(--color-border)]'}`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggle(t.id)}
                      disabled={toggling === t.id}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                        t.isActive
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                      data-testid={`testimonial-toggle-${t.id}`}
                    >
                      {toggling === t.id ? '...' : t.isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        data-testid={`testimonial-edit-${t.id}`}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-accent)] transition-colors cursor-pointer"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deleting === t.id}
                        data-testid={`testimonial-delete-${t.id}`}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-error-dark)] transition-colors disabled:opacity-50 cursor-pointer"
                        aria-label="Hapus"
                      >
                        {deleting === t.id ? (
                          <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowModal(false) }}
        >
          <div className="bg-white rounded-[20px] shadow-lg border border-[var(--color-border)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSave}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-xl text-[var(--color-text-primary)]">
                    {editingId ? 'Edit Testimoni' : 'Tambah Testimoni'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                    aria-label="Tutup"
                  >
                    <X className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Nama</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Asal / Pekerjaan</label>
                    <input
                      type="text"
                      value={form.origin}
                      onChange={(e) => setForm({ ...form, origin: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Testimoni</label>
                    <textarea
                      value={form.quote}
                      onChange={(e) => setForm({ ...form, quote: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Rating</label>
                    <StarSelector value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                      Foto <span className="text-[var(--color-text-muted)]">(opsional)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        setPhotoFile(e.target.files?.[0] || null)
                        setRemovePhoto(false)
                      }}
                      className="w-full text-sm text-[var(--color-text-secondary)] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white file:cursor-pointer hover:file:bg-[var(--color-primary-dark)]"
                    />
                    {editingId && testimonials.find((t) => t.id === editingId)?.photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setRemovePhoto(true)
                          setPhotoFile(null)
                        }}
                        className={`mt-2 text-xs font-medium px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          removePhoto
                            ? 'bg-[var(--color-error)]/20 text-[var(--color-error-dark)] border-[var(--color-error)]'
                            : 'text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-error-dark)] hover:border-[var(--color-error)]'
                        }`}
                      >
                        {removePhoto ? 'Foto akan dihapus saat disimpan' : 'Hapus Foto'}
                      </button>
                    )}
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">Format: JPEG, PNG, WebP. Maks 500KB.</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tinted)] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
