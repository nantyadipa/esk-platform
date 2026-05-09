'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ui/toast-container'

type StudentCourse = { id: string; name: string } | null

type Student = {
  id: string
  name: string
  phone: string
  selectedCourse: StudentCourse
  mode: 'online' | 'offline'
  referralCode: string | null
  status: 'aktif' | 'tidak_aktif' | 'trial'
  notes: string | null
  createdAt: string
}

type Course = {
  id: string
  name: string
}

type StudentMode = 'online' | 'offline'
type StudentStatus = 'aktif' | 'tidak_aktif' | 'trial'

const statusLabels: Record<StudentStatus, string> = {
  aktif: 'Aktif',
  tidak_aktif: 'Tidak Aktif',
  trial: 'Trial',
}

const statusBadgeClass: Record<StudentStatus, string> = {
  aktif: 'bg-[var(--color-success)]/20 text-[var(--color-success-dark)]',
  tidak_aktif: 'bg-[var(--color-error)]/20 text-[var(--color-error-dark)]',
  trial: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
}

const modeLabels: Record<StudentMode, string> = {
  online: 'Online',
  offline: 'Offline',
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filterCourse, setFilterCourse] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [search, setSearch] = useState('')
  const { toasts, success, error } = useToast()

  useEffect(() => {
    let ignore = false
    async function loadData() {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/courses'),
        ])
        const [studentsData, coursesData] = await Promise.all([studentsRes.json(), coursesRes.json()])
        if (!ignore) {
          setStudents(studentsData)
          setCourses(coursesData)
        }
      } catch {
        console.error('Failed to fetch data')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadData()
    return () => { ignore = true }
  }, [])

  const filteredStudents = students.filter((s) => {
    if (filterCourse && s.selectedCourse?.id !== filterCourse) return false
    if (filterStatus && s.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      if (!s.name.toLowerCase().includes(q) && !s.phone.includes(q)) return false
    }
    return true
  })

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setStudents(students.filter(s => s.id !== id))
        setDeleteConfirm(null)
        success('Siswa berhasil dihapus')
      } else {
        const data = await res.json().catch(() => ({}))
        error(data.error || 'Gagal menghapus siswa')
      }
    } catch {
      console.error('Failed to delete student')
      error('Gagal menghapus siswa')
    } finally {
      setDeletingId(null)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingStudent(null)
    window.location.reload()
  }

  return (
    <div data-testid="admin-students">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
          Kelola Siswa
        </h1>
        <button
          data-testid="btn-add-student"
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Siswa
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari nama atau no. HP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="">Semua Kursus</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="tidak_aktif">Tidak Aktif</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
          <p className="mt-2 text-[var(--color-text-secondary)]">Memuat...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">Belum ada siswa.</p>
          <button
            data-testid="btn-add-first-student"
            onClick={() => setShowModal(true)}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all cursor-pointer"
          >
            Tambah Siswa Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-page)]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Nama</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Kursus</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Mode</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Referral</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-page)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[var(--color-text-primary)]">{student.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    {student.selectedCourse?.name || <span className="text-[var(--color-text-muted)]">—</span>}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">{modeLabels[student.mode]}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadgeClass[student.status]}`}>
                      {statusLabels[student.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] text-sm">
                    {student.referralCode || <span className="text-[var(--color-text-muted)]">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        data-testid={`btn-edit-${student.id}`}
                        onClick={() => { setEditingStudent(student); setShowModal(true) }}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] p-2 rounded-lg hover:bg-[var(--color-primary-ghost)] transition-all cursor-pointer"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        data-testid={`btn-delete-${student.id}`}
                        onClick={() => setDeleteConfirm(student.id)}
                        disabled={deletingId === student.id}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-error-dark)] p-2 rounded-lg hover:bg-[var(--color-error)]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Hapus"
                      >
                        {deletingId === student.id ? (
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(183,110,121,0.2)] border border-[var(--color-border)] w-full max-w-sm p-6">
            <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-2">Hapus Siswa?</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Apakah kamu yakin ingin menghapus siswa ini? Tindakan ini tidak dapat dibatalkan.
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
        <StudentModal
          student={editingStudent}
          courses={courses}
          onClose={handleModalClose}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}

type StudentModalProps = {
  student: Student | null
  courses: Course[]
  onClose: () => void
}

function StudentModal({ student, courses, onClose }: StudentModalProps) {
  const [form, setForm] = useState({
    name: student?.name || '',
    phone: student?.phone || '',
    selectedCourseId: student?.selectedCourse?.id || '',
    mode: (student?.mode || 'online') as StudentMode,
    status: (student?.status || 'aktif') as StudentStatus,
    referralCode: student?.referralCode || '',
    notes: student?.notes || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Nama tidak boleh kosong'
    if (!form.phone.trim()) newErrors.phone = 'No. HP tidak boleh kosong'
    if (form.phone.length < 8) newErrors.phone = 'No. WhatsApp tidak valid'
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
        phone: form.phone,
        selectedCourseId: form.selectedCourseId || null,
        mode: form.mode,
        status: form.status,
        referralCode: form.referralCode || null,
        notes: form.notes || null,
      }

      const url = student ? `/api/students/${student.id}` : '/api/students'
      const method = student ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan siswa')
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
              {student ? 'Edit Siswa' : 'Tambah Siswa Baru'}
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
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              data-testid="input-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all ${errors.name ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
              placeholder="Nama lengkap siswa"
            />
            {errors.name && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">No. WhatsApp</label>
            <input
              id="phone"
              type="text"
              data-testid="input-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all ${errors.phone ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
              placeholder="6281234567890"
            />
            {errors.phone && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="selectedCourseId" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Kursus</label>
            <select
              id="selectedCourseId"
              data-testid="input-course"
              value={form.selectedCourseId}
              onChange={(e) => setForm({ ...form, selectedCourseId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            >
              <option value="">Pilih Kursus</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Mode</label>
              <select
                id="mode"
                data-testid="input-mode"
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value as StudentMode })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Status</label>
              <select
                id="status"
                data-testid="input-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as StudentStatus })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              >
                <option value="aktif">Aktif</option>
                <option value="tidak_aktif">Tidak Aktif</option>
                <option value="trial">Trial</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Kode Referral <span className="text-[var(--color-text-muted)]">(opsional)</span></label>
            <input
              id="referralCode"
              type="text"
              data-testid="input-referral"
              value={form.referralCode}
              onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              placeholder="Kode referral jika ada"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Catatan <span className="text-[var(--color-text-muted)]">(opsional)</span></label>
            <textarea
              id="notes"
              data-testid="input-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
              placeholder="Catatan tambahan..."
            />
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
              ) : student ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}