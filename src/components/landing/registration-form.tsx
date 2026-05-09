'use client'

import { useState } from 'react'
import { registrationFormSchema } from '@/lib/validations'
import { generateWhatsAppURL } from '@/lib/actions/registration-actions'

type Mode = 'online' | 'offline'

type RegistrationFormProps = {
  courses: { id: string; name: string }[]
  selectedCourseName?: string
  onClose: () => void
}

type FormState = {
  name: string
  phone: string
  selectedClass: string
  mode: Mode
  referralCode: string
}

type FormErrors = {
  name?: string
  phone?: string
  selectedClass?: string
  mode?: string
}

export function RegistrationForm({
  courses,
  selectedCourseName,
  onClose,
}: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    selectedClass: selectedCourseName || '',
    mode: 'online' as Mode,
    referralCode: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isClassLocked = !!selectedCourseName

  const validate = (): boolean => {
    const result = registrationFormSchema.safeParse(form)
    if (result.success) {
      setErrors({})
      return true
    }
    const fieldErrors: FormErrors = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormErrors
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
    setErrors(fieldErrors)
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('phone', form.phone)
      formData.append('selectedClass', form.selectedClass)
      formData.append('mode', form.mode)
      if (form.referralCode) {
        formData.append('referralCode', form.referralCode)
      }

      const result = await generateWhatsAppURL(formData)
      if (result.success && result.data) {
        window.open(result.data.url, '_blank')
        onClose()
      } else {
        setSubmitError(result.error || 'Ada yang salah. Coba lagi ya.')
      }
    } catch {
      setSubmitError('Ada yang salah. Coba lagi ya.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      data-testid="registration-form-overlay"
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        data-testid="registration-form"
        className="bg-[var(--color-bg-surface)] rounded-[20px] shadow-[0_8px_32px_rgba(183,110,121,0.2)] border border-[var(--color-border)] w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-[var(--color-text-primary)]">
              Form Pendaftaran
            </h3>
            <button
              data-testid="registration-form-close"
              onClick={onClose}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              aria-label="Tutup form"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Nama Lengkap
              </label>
              <input
                id="reg-name"
                type="text"
                data-testid="reg-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                placeholder="Nama lengkap kamu"
                aria-describedby={errors.name ? 'reg-name-error' : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p id="reg-name-error" className="mt-1 text-xs text-[var(--color-error-dark)]" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                No. WhatsApp
              </label>
              <input
                id="reg-phone"
                type="tel"
                data-testid="reg-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                placeholder="08xxxxxxxxxx"
                aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p id="reg-phone-error" className="mt-1 text-xs text-[var(--color-error-dark)]" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="reg-class" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Kelas
              </label>
              {isClassLocked ? (
                <input
                  id="reg-class"
                  type="text"
                  data-testid="reg-class"
                  value={form.selectedClass}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-tinted)] text-sm cursor-not-allowed opacity-80"
                  aria-describedby={errors.selectedClass ? 'reg-class-error' : undefined}
                />
              ) : (
                <select
                  id="reg-class"
                  data-testid="reg-class"
                  value={form.selectedClass}
                  onChange={(e) => setForm({ ...form, selectedClass: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  aria-describedby={errors.selectedClass ? 'reg-class-error' : undefined}
                  aria-invalid={!!errors.selectedClass}
                >
                  <option value="">Pilih kelas</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.selectedClass && (
                <p id="reg-class-error" className="mt-1 text-xs text-[var(--color-error-dark)]" role="alert">
                  {errors.selectedClass}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Mode Kelas
              </label>
              <div className="flex gap-3" role="radiogroup" aria-label="Pilih mode kelas">
                {(['online', 'offline'] as Mode[]).map((m) => (
                  <label
                    key={m}
                    data-testid={`reg-mode-${m}`}
                    className={`flex-1 text-center py-2.5 rounded-2xl border text-sm cursor-pointer transition-all ${
                      form.mode === m
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[var(--shadow-cta)]'
                        : 'border-[var(--color-border)] bg-[var(--color-bg-page)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={m}
                      checked={form.mode === m}
                      onChange={() => setForm({ ...form, mode: m })}
                      className="sr-only"
                    />
                    {m === 'online' ? 'Online' : 'Offline'}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="reg-referral" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Kode Referral <span className="text-[var(--color-text-muted)]">(opsional)</span>
              </label>
              <input
                id="reg-referral"
                type="text"
                data-testid="reg-referral"
                value={form.referralCode}
                onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                placeholder="Masukkan kode referral"
              />
            </div>

            {submitError && (
              <div data-testid="registration-error" className="p-3 rounded-2xl bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm" role="alert">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              data-testid="registration-submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--color-primary)] text-white py-3 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-cta-lg)] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                'Chat WhatsApp untuk Daftar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}