'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ui/toast-container'

const FullCalendarComponent = dynamic(() => import('./schedule-calendar'), { ssr: false })

type Course = { id: string; name: string }
type Student = { id: string; name: string }
type ScheduleStudent = { student: { id: string; name: string } }

type Schedule = {
  id: string
  courseId: string
  date: string
  startTime: string
  endTime: string
  meetingNumber: number
  zoomLink: string | null
  mode: 'online' | 'offline'
  notes: string | null
  course: { id: string; name: string }
  students: ScheduleStudent[]
}

const COURSE_COLORS = [
  '#B76E79', '#7FB8A8', '#D4976B', '#8B9DC3', '#B8A8D4',
  '#D4A8A8', '#A8C9D4', '#C9D4A8', '#D4C99B', '#9BB8D4',
]

function getCourseColor(index: number): string {
  return COURSE_COLORS[index % COURSE_COLORS.length]
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCourse, setFilterCourse] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const calendarRef = useRef<{ getApi: () => unknown } | null>(null)
  const { toasts, success, error } = useToast()

  useEffect(() => {
    let ignore = false
    async function fetchData() {
      try {
        const [schedulesRes, coursesRes] = await Promise.all([
          fetch('/api/schedules'),
          fetch('/api/courses'),
        ])
        const [schedulesData, coursesData] = await Promise.all([schedulesRes.json(), coursesRes.json()])
        if (!ignore) {
          setSchedules(schedulesData)
          setCourses(coursesData)
        }
      } catch {
        console.error('Failed to fetch data')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetchData()
    return () => { ignore = true }
  }, [])

  const filteredSchedules = filterCourse
    ? schedules.filter((s) => s.courseId === filterCourse)
    : schedules

  const events = filteredSchedules.map((schedule, idx) => {
    const courseIdx = courses.findIndex((c) => c.id === schedule.courseId)
    const color = getCourseColor(courseIdx >= 0 ? courseIdx : idx)
    const dateStr = schedule.date.split('T')[0]
    const startStr = schedule.startTime.split('T')[1]?.substring(0, 8) || '09:00:00'
    const endStr = schedule.endTime.split('T')[1]?.substring(0, 8) || '10:00:00'

    return {
      id: schedule.id,
      title: `Meet ${schedule.meetingNumber} — ${schedule.course.name}`,
      start: `${dateStr}T${startStr}`,
      end: `${dateStr}T${endStr}`,
      backgroundColor: color,
      borderColor: color,
      extendedProps: { schedule },
    }
  })

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setEditingSchedule(null)
    setShowModal(true)
  }

  const handleEventClick = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setSelectedDate(null)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingSchedule(null)
    setSelectedDate(null)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
        <p className="mt-2 text-[var(--color-text-secondary)] ml-4">Memuat jadwal...</p>
      </div>
    )
  }

  return (
    <div data-testid="admin-schedules">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
          Kelola Jadwal
        </h1>
        <div className="flex items-center gap-3">
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
          <button
            onClick={() => { setSelectedDate(new Date()); setEditingSchedule(null); setShowModal(true) }}
            className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Jadwal
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4">
        <FullCalendarComponent
          ref={calendarRef}
          events={events}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      </div>

      {showModal && (
        <ScheduleModal
          schedule={editingSchedule}
          courses={courses}
          initialDate={selectedDate}
          onClose={handleModalClose}
          onSuccess={(msg: string) => success(msg)}
          onError={(msg: string) => error(msg)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}

type ScheduleModalProps = {
  schedule: Schedule | null
  courses: Course[]
  initialDate: Date | null
  onClose: () => void
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
}

function ScheduleModal({ schedule, courses, initialDate, onClose, onSuccess, onError }: ScheduleModalProps) {
  const [form, setForm] = useState({
    courseId: schedule?.course?.id || '',
    date: schedule?.date?.split('T')[0] || (initialDate ? initialDate.toISOString().split('T')[0] : ''),
    startTime: schedule?.startTime?.split('T')[1]?.substring(0, 5) || '19:00',
    endTime: schedule?.endTime?.split('T')[1]?.substring(0, 5) || '21:00',
    meetingNumber: schedule?.meetingNumber?.toString() || '1',
    zoomLink: schedule?.zoomLink || '',
    mode: (schedule?.mode || 'online') as 'online' | 'offline',
    studentIds: schedule?.students.map((s) => s.student.id) || [],
    notes: schedule?.notes || '',
  })
  const [students, setStudents] = useState<Student[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let ignore = false
    async function loadStudents() {
      const res = await fetch('/api/students?status=aktif')
      const data = await res.json()
      if (!ignore) setStudents(data)
    }
    loadStudents()
    return () => { ignore = true }
  }, [])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.courseId) newErrors.courseId = 'Pilih kursus'
    if (!form.date) newErrors.date = 'Pilih tanggal'
    if (!form.startTime) newErrors.startTime = 'Waktu mulai wajib diisi'
    if (!form.endTime) newErrors.endTime = 'Waktu selesai wajib diisi'
    if (form.startTime >= form.endTime) newErrors.endTime = 'Waktu selesai harus setelah mulai'
    const meetNum = parseInt(form.meetingNumber)
    if (isNaN(meetNum) || meetNum < 1) newErrors.meetingNumber = 'No. pertemuan tidak valid'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const dateWithStart = new Date(`${form.date}T${form.startTime}:00`)
      const dateWithEnd = new Date(`${form.date}T${form.endTime}:00`)

      const payload = {
        courseId: form.courseId,
        date: dateWithStart.toISOString(),
        startTime: dateWithStart.toISOString(),
        endTime: dateWithEnd.toISOString(),
        meetingNumber: parseInt(form.meetingNumber),
        zoomLink: form.zoomLink || null,
        mode: form.mode,
        studentIds: form.studentIds,
        notes: form.notes || null,
      }

      const url = schedule ? `/api/schedules/${schedule.id}` : '/api/schedules'
      const method = schedule ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan jadwal')
      }

      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ada yang salah. Coba lagi ya.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/schedules/${schedule!.id}`, { method: 'DELETE' })
      if (res.ok) {
        onSuccess('Jadwal berhasil dihapus')
        onClose()
      } else {
        const data = await res.json().catch(() => ({}))
        onError(data.error || 'Gagal menghapus jadwal')
      }
    } catch {
      setSubmitError('Gagal menghapus jadwal')
      onError('Gagal menghapus jadwal')
    } finally {
      setDeleting(false)
    }
  }

  const toggleStudent = (studentId: string) => {
    setForm((f) => ({
      ...f,
      studentIds: f.studentIds.includes(studentId)
        ? f.studentIds.filter((id) => id !== studentId)
        : [...f.studentIds, studentId],
    }))
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
              {schedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
            </h3>
            <button
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
            <div className="p-3 rounded-xl bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm">
              {submitError}
            </div>
          )}

          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Kursus</label>
            <select
              id="courseId"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.courseId ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
            >
              <option value="">Pilih Kursus</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.courseId && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.courseId}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label htmlFor="meetingNumber" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Meet #</label>
              <input
                id="meetingNumber"
                type="number"
                min="1"
                value={form.meetingNumber}
                onChange={(e) => setForm({ ...form, meetingNumber: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.meetingNumber ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
              />
              {errors.meetingNumber && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.meetingNumber}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="date" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Tanggal</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.date ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
              />
              {errors.date && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Waktu Mulai</label>
              <input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.startTime ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
              />
              {errors.startTime && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.startTime}</p>}
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Waktu Selesai</label>
              <input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.endTime ? 'border-[var(--color-error-dark)]' : 'border-[var(--color-border)]'}`}
              />
              {errors.endTime && <p className="mt-1 text-xs text-[var(--color-error-dark)]">{errors.endTime}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="zoomLink" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Zoom Link <span className="text-[var(--color-text-muted)]">(opsional)</span></label>
            <input
              id="zoomLink"
              type="url"
              value={form.zoomLink}
              onChange={(e) => setForm({ ...form, zoomLink: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="https://zoom.us/j/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Mode</label>
            <div className="flex gap-3">
              {(['online', 'offline'] as const).map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value={m}
                    checked={form.mode === m}
                    onChange={() => setForm({ ...form, mode: m })}
                    className="w-4 h-4 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm text-[var(--color-text-primary)] capitalize">{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Siswa <span className="text-[var(--color-text-muted)] font-normal">(opsional)</span>
            </label>
            <div className="max-h-40 overflow-y-auto border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-page)]">
              {students.length === 0 ? (
                <p className="p-3 text-sm text-[var(--color-text-muted)]">Tidak ada siswa aktif.</p>
              ) : (
                students.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-primary-ghost)] cursor-pointer border-b border-[var(--color-border-subtle)] last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={form.studentIds.includes(s.id)}
                      onChange={() => toggleStudent(s.id)}
                      className="w-4 h-4 accent-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-primary)]">{s.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Catatan <span className="text-[var(--color-text-muted)]">(opsional)</span></label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
              placeholder="Catatan tambahan..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            {schedule && (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-full bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm font-semibold hover:bg-[var(--color-error)]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Hapus
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={submitting || deleting}
              className="flex-1 px-4 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
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
              ) : schedule ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </button>
          </div>
        </form>

        {deleteConfirm && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
            <div className="bg-white rounded-xl p-6 w-full max-w-xs mx-4 shadow-xl border border-[var(--color-border)]">
              <h4 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-2">Hapus Jadwal?</h4>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Apakah kamu yakin ingin menghapus jadwal ini? Tindakan tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-full bg-[var(--color-error)] text-white text-sm font-semibold hover:bg-[var(--color-error-dark)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {deleting ? (
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
      </div>
    </div>
  )
}