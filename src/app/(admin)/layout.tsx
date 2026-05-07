'use client'

import { AuthProvider } from '@/hooks/use-auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div data-testid="admin-layout" className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-[var(--color-bg-page)]">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}