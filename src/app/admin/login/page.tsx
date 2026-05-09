import { AdminLoginForm } from '@/components/admin/admin-login-form'

export default function AdminLoginPage() {
  return (
    <div data-testid="admin-login" className="min-h-screen flex items-center justify-center bg-[var(--color-bg-page)]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[var(--shadow-card)] border border-[var(--color-border)]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg font-display">ESK</span>
          </div>
          <h1 className="font-display font-bold text-xl text-[var(--color-text-primary)]">
            Admin Login
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Masuk ke dashboard English Sepulang Kerja
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}