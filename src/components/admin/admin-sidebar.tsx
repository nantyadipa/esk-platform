'use client'

import { useAuth } from '@/hooks/use-auth'

export function AdminSidebar() {
  const { user, signOut } = useAuth()

  const navItems = [
    { href: '/admin', label: 'Overview', testId: 'admin-nav-overview' },
    { href: '/admin/courses', label: 'Kursus', testId: 'admin-nav-courses' },
    { href: '/admin/students', label: 'Siswa', testId: 'admin-nav-students' },
    { href: '/admin/schedules', label: 'Jadwal', testId: 'admin-nav-schedules' },
    { href: '/admin/content', label: 'Konten', testId: 'admin-nav-content' },
    { href: '/admin/settings', label: 'Pengaturan', testId: 'admin-nav-settings' },
  ]

  return (
    <aside
      data-testid="admin-sidebar"
      className="w-64 bg-white border-r border-[var(--color-border)] min-h-screen p-6"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm font-display">
            ESK
          </div>
          <div>
            <h1 className="font-display font-bold text-[var(--color-text-primary)] text-sm">
              English Sepulang Kerja
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            data-testid={item.testId}
            className="block px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-ghost)] hover:text-[var(--color-text-accent)] transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {user && (
        <div className="mt-8 pt-4 border-t border-[var(--color-border)]">
          <button
            onClick={signOut}
            data-testid="admin-btn-logout"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)]"
          >
            Keluar
          </button>
        </div>
      )}
    </aside>
  )
}