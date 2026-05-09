'use client'

import type { Toast } from '@/hooks/use-toast'

type ToastContainerProps = {
  toasts: Toast[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const bgClass =
    toast.type === 'success'
      ? 'bg-green-600'
      : toast.type === 'error'
        ? 'bg-red-600'
        : 'bg-gray-800'

  return (
    <div
      className={`${bgClass} text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all`}
    >
      {toast.message}
    </div>
  )
}
