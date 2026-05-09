'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, formatDiscountDisplay } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ui/toast-container'

type Course = {
  id: string
  name: string
  description: string
  basePrice: number
  discountRate: number
  numberOfSessions: number
  modeAvailable: 'online' | 'offline' | 'both'
  isActive: boolean
}

type ModeAvailable = 'online' | 'offline' | 'both'

const modeLabels: Record<ModeAvailable, string> = {
  online: 'Online',
  offline: 'Offline',
  both: 'Online & Offline',
}

const modeBadgeClass: Record<ModeAvailable, string> = {
  online: 'bg-blue-50 text-blue-700 border-blue-200',
  offline: 'bg-orange-50 text-orange-700 border-orange-200',
  both: 'bg-[var(--color-primary-ghost)] text-[var(--color-text-accent)] border-[var(--color-border)]',
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toasts, success, error } = useToast()

  useEffect(() => {
    let ignore = false
    async function loadCourses() {
      try {
        const res = await fetch('/api/courses')
        const data = await res.json()
        if (!ignore) {
          setCourses(data)
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    loadCourses()
    return () => { ignore = true }
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== id))
        setDeleteConfirm(null)
        success('Kursus berhasil dihapus')
      } else {
        const data = await res.json().catch(() => ({}))
        error(data.error || 'Gagal menghapus kursus')
      }
    } catch (err) {
      console.error('Failed to delete course:', err)
      error('Gagal menghapus kursus')
    } finally {
      setDeletingId(null)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingCourse(null)
    window.location.reload()
  }

  return (
    <div data-testid="admin-courses">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
          Kelola Kursus
        </h1>
        <button
          data-testid="btn-add-course"
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kursus
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
          <p className="mt-2 text-[var(--color-text-secondary)]">Memuat...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">Belum ada kursus.</p>
          <button
            data-testid="btn-add-first-course"
            onClick={() => setShowModal(true)}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all cursor-pointer"
          >
            Tambah Kursus Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-page)]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Kursus</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Harga</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Pertemuan</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Mode</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const { final, hasDiscount } = formatDiscountDisplay(course.basePrice, course.discountRate)
                return (
                  <tr key={course.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-page)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--color-text-primary)]">{course.name}</div>
                      <div className="text-sm text-[var(--color-text-secondary)] truncate max-w-xs">{course.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--color-text-primary)]">{final}</div>
                      {hasDiscount && (
                        <div className="text-xs text-[var(--color-text-muted)] line-through">{formatCurrency(course.basePrice)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">{course.numberOfSessions}x</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${modeBadgeClass[course.modeAvailable]}`}>
                        {modeLabels[course.modeAvailable]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        course.isActive
                          ? 'bg-[var(--color-success)]/20 text-[var(--color-success-dark)]'
                          : 'bg-[var(--color-error)]/20 text-[var(--color-error-dark)]'
                      }`}>
                        {course.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          data-testid={`btn-edit-${course.id}`}
                          onClick={() => { setEditingCourse(course); setShowModal(true) }}
                          className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] p-2 rounded-lg hover:bg-[var(--color-primary-ghost)] transition-all cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          data-testid={`btn-delete-${course.id}`}
                          onClick={() => setDeleteConfirm(course.id)}
                          disabled={deletingId === course.id}
                          className="text-[var(--color-text-secondary)] hover:text-[var(--color-error-dark)] p-2 rounded-lg hover:bg-[var(--color-error)]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          title="Hapus"
                        >
                          {deletingId === course.id ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(183,110,121,0.2)] border border-[var(--color-border)] w-full max-w-sm p-6">
            <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-2">Hapus Kursus?</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Apakah kamu yakin ingin menghapus kursus ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                data-testid="btn-cancel-delete"
                onClick={() => setDeleteConfirm(null)}
                disabled={!!deletingId}
                className="flex-1 px-4 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                data-testid="btn-confirm-delete"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={!!deletingId}
                className="flex-1 px-4 py-2.5 rounded-full bg-[var(--color-error)] text-white text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-error-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {deletingId ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menghapus...
                  </>
                ) : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <CourseModal
          course={editingCourse}
          onClose={handleModalClose}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}

function CourseModal({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const [form, setForm] = useState({
    name: course?.name || '',
    description: course?.description || '',
    basePrice: course?.basePrice?.toString() || '',
    discountRate: course?.discountRate?.toString() || '0',
    numberOfSessions: course?.numberOfSessions?.toString() || '',
    modeAvailable: course?.modeAvailable || 'both' as ModeAvailable,
    isActive: course?.isActive ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Nama kursus tidak boleh kosong'
    if (!form.description.trim()) newErrors.description = 'Deskripsi tidak boleh kosong'
    const price = parseFloat(form.basePrice)
    if (isNaN(price) || price < 0) newErrors.basePrice = 'Harga tidak valid'
    const discount = parseFloat(form.discountRate)
    if (isNaN(discount) || discount < 0 || discount > 1) newErrors.discountRate = 'Diskon harus antara 0 dan 100%'
    const sessions = parseInt(form.numberOfSessions)
    if (isNaN(sessions) || sessions < 1) newErrors.numberOfSessions = 'Minimal 1 pertemuan'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        name: form.name,
        description: form.description,
        basePrice: parseFloat(form.basePrice),
        discountRate: parseFloat(form.discountRate),
        numberOfSessions: parseInt(form.numberOfSessions),
        modeAvailable: form.modeAvailable,
        isActive: form.isActive,
      }

      const url = course ? `/api/courses/${course.id}` : '/api/courses'
      const method = course ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan kursus')
      }

      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ada yang salah. Coba lagi ya.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(183,110,121,0.2)] border border-[var(--color-border)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-[var(--color-text-primary)]">
              {course ? 'Edit Kursus' : 'Tambah Kursus Baru'}
            </h3>
            <button
              data-testid="btn-close-modal"
              onClick={onClose}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div data-testid="submit-error" className="p-3 rounded-xl bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm" role="alert">
              {submitError}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Nama Kursus</label>
            <input
              id="name"
              type="text"
              data-testid="input-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all ${errors.name ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
              placeholder="Contoh: TOEFL Preparation"
            />
            {errors.name && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Deskripsi</label>
            <textarea
              id="description"
              data-testid="input-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none ${errors.description ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
              placeholder="Jelaskan tentang kursus ini..."
            />
            {errors.description && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Harga Dasar (Rp)</label>
              <input
                id="basePrice"
                type="number"
                data-testid="input-base-price"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all ${errors.basePrice ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
                placeholder="500000"
                min="0"
              />
              {errors.basePrice && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.basePrice}</p>}
            </div>

            <div>
              <label htmlFor="discountRate" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Diskon (%)</label>
              <input
                id="discountRate"
                type="number"
                data-testid="input-discount-rate"
                value={(parseFloat(form.discountRate) * 100).toString()}
                onChange={(e) => setForm({ ...form, discountRate: (parseFloat(e.target.value) / 100).toString() })}
                className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all ${errors.discountRate ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
                placeholder="10"
                min="0"
                max="100"
              />
              {errors.discountRate && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.discountRate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="numberOfSessions" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Jumlah Pertemuan</label>
              <input
                id="numberOfSessions"
                type="number"
                data-testid="input-sessions"
                value={form.numberOfSessions}
                onChange={(e) => setForm({ ...form, numberOfSessions: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all ${errors.numberOfSessions ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
                placeholder="8"
                min="1"
              />
              {errors.numberOfSessions && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.numberOfSessions}</p>}
            </div>

            <div>
              <label htmlFor="modeAvailable" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Mode</label>
              <select
                id="modeAvailable"
                data-testid="input-mode"
                value={form.modeAvailable}
                onChange={(e) => setForm({ ...form, modeAvailable: e.target.value as ModeAvailable })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              >
                <option value="both">Online & Offline</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                data-testid="input-is-active"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--color-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
            </label>
            <span className="text-sm text-[var(--color-text-primary)]">Kursus aktif</span>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              data-testid="btn-cancel"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              data-testid="btn-submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : course ? 'Simpan Perubahan' : 'Tambah Kursus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}