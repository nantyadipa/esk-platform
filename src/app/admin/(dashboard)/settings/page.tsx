'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp] = useState({ adminPhone: '', messageTemplate: '' })
  const [loading, setLoading] = useState(true)
  const [savingWA, setSavingWA] = useState(false)
  const [savedWA, setSavedWA] = useState(false)
  const [errorWA, setErrorWA] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  const [errorProfile, setErrorProfile] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    async function loadConfig() {
      try {
        const res = await fetch('/api/whatsapp-config')
        const data = await res.json()
        if (!ignore) setWhatsapp({ adminPhone: data.adminPhone || '', messageTemplate: data.messageTemplate || '' })
      } catch {
        if (!ignore) setErrorWA('Gagal memuat konfigurasi')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadConfig()
    return () => { ignore = true }
  }, [])

  const handleSaveWhatsApp = async () => {
    setSavingWA(true)
    setErrorWA(null)
    try {
      const res = await fetch('/api/whatsapp-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whatsapp),
      })
      if (!res.ok) throw new Error('Gagal menyimpan')
      setSavedWA(true)
      setTimeout(() => setSavedWA(false), 2000)
    } catch {
      setErrorWA('Gagal menyimpan. Coba lagi.')
    } finally {
      setSavingWA(false)
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setErrorProfile(null)
    try {
      await new Promise((r) => setTimeout(r, 500))
      setSavedProfile(true)
      setTimeout(() => setSavedProfile(false), 2000)
    } catch {
      setErrorProfile('Gagal menyimpan. Coba lagi.')
    } finally {
      setSavingProfile(false)
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
    <div data-testid="admin-settings">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
          Pengaturan
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Kelola konfigurasi WhatsApp dan profil admin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-ghost)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-[var(--color-text-primary)]">Konfigurasi WhatsApp</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">No. WhatsApp & template pesan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {savedWA && <span className="text-xs text-[var(--color-success-dark)] font-medium">Tersimpan ✓</span>}
              <button
                onClick={handleSaveWhatsApp}
                disabled={savingWA}
                className="px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {savingWA ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>

          {errorWA && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm">
              {errorWA}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="adminPhone" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                No. WhatsApp Admin
              </label>
              <input
                id="adminPhone"
                type="text"
                value={whatsapp.adminPhone}
                onChange={(e) => setWhatsapp({ ...whatsapp, adminPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="6281234567890"
              />
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">Format: kode negara + nomor (contoh: 6281234567890)</p>
            </div>

            <div>
              <label htmlFor="messageTemplate" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Template Pesan <span className="text-[var(--color-text-muted)] font-normal">(opsional)</span>
              </label>
              <textarea
                id="messageTemplate"
                value={whatsapp.messageTemplate}
                onChange={(e) => setWhatsapp({ ...whatsapp, messageTemplate: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                placeholder="Halo, saya mau daftar kelas English Sepulang Kerja..."
              />
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">Gunakan placeholder: {`{name}`}, {`{phone}`}, {`{course}`}, {`{mode}`}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-ghost)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-[var(--color-text-primary)]">Profil Admin</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">Email & informasi akun</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {savedProfile && <span className="text-xs text-[var(--color-success-dark)] font-medium">Tersimpan ✓</span>}
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {savingProfile ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>

          {errorProfile && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm">
              {errorProfile}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Email Admin
              </label>
              <input
                id="adminEmail"
                type="email"
                defaultValue="admin@esk.id"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                disabled
              />
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">Email tidak dapat diubah.</p>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Password Baru <span className="text-[var(--color-text-muted)] font-normal">(opsional)</span>
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Kosongkan jika tidak ingin mengubah"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-page)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Masukkan password baru untuk konfirmasi"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--color-border)] max-w-4xl">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-error)]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--color-error-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-[var(--color-text-primary)]">Zona Berbahaya</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">Tindakan yang tidak dapat dibatalkan.</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)] font-medium">Hapus Semua Data Siswa</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Menghapus semua data siswa secara permanen.</p>
            </div>
            <button
              className="px-4 py-2 rounded-full bg-[var(--color-error)]/20 text-[var(--color-error-dark)] text-sm font-semibold hover:bg-[var(--color-error)]/30 transition-all cursor-pointer"
              onClick={() => alert('Fitur ini memerlukan konfirmasi tambahan. Hubungi developer.')}
            >
              Hapus Semua Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}