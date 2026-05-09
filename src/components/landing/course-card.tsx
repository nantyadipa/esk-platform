import { formatCurrency, calculateFinalPrice } from '@/lib/utils'

type ModeAvailable = 'online' | 'offline' | 'both'

const modeLabels: Record<ModeAvailable, string> = {
  online: 'Online',
  offline: 'Offline',
  both: 'Online & Offline',
}

const modeBadges: Record<ModeAvailable, string> = {
  online: 'bg-blue-50 text-blue-700 border-blue-200',
  offline: 'bg-orange-50 text-orange-700 border-orange-200',
  both: 'bg-[var(--color-primary-ghost)] text-[var(--color-text-accent)] border-[var(--color-border)]',
}

type CourseCardProps = {
  id: string
  name: string
  description: string
  basePrice: number
  discountRate: number
  numberOfSessions: number
  modeAvailable: ModeAvailable
  onSelect: (courseId: string, courseName: string) => void
}

export function CourseCard({
  id,
  name,
  description,
  basePrice,
  discountRate,
  numberOfSessions,
  modeAvailable,
  onSelect,
}: CourseCardProps) {
  const finalPrice = calculateFinalPrice(basePrice, discountRate)
  const hasDiscount = discountRate > 0 && discountRate < 1
  const isFree = discountRate >= 1

  return (
    <div
      data-testid={`course-card-${id}`}
      className="bg-[var(--color-bg-surface)] rounded-[20px] border border-[var(--color-border)] shadow-[0_2px_12px_rgba(183,110,121,0.08)] hover:shadow-[0_4px_20px_rgba(183,110,121,0.15)] transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-display font-bold text-xl text-[var(--color-text-primary)]">
            {name}
          </h4>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${modeBadges[modeAvailable]}`}
          >
            {modeLabels[modeAvailable]}
          </span>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] mb-4 flex-1 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-2 mb-4 text-sm text-[var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
            {numberOfSessions} pertemuan
          </span>
        </div>

        <div className="mb-5" data-testid={`price-display-${id}`}>
          {isFree ? (
            <div className="flex items-baseline gap-2">
              <span className="line-through text-[var(--color-text-muted)] text-sm">
                {formatCurrency(basePrice)}
              </span>
              <span className="font-display font-bold text-2xl text-[var(--color-success-dark)]">
                Gratis
              </span>
            </div>
          ) : hasDiscount ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="line-through text-[var(--color-text-muted)] text-sm">
                {formatCurrency(basePrice)}
              </span>
              <span className="font-display font-bold text-2xl text-[var(--color-text-accent)]">
                {formatCurrency(finalPrice)}
              </span>
              <span
                data-testid={`discount-badge-${id}`}
                className="text-xs font-semibold bg-[var(--color-primary-lighter)] text-[var(--color-text-accent)] px-2 py-0.5 rounded-full animate-pulse"
              >
                {Math.round(discountRate * 100)}% OFF
              </span>
            </div>
          ) : (
            <span className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
              {formatCurrency(basePrice)}
            </span>
          )}
        </div>

        <button
          data-testid={`course-cta-${id}`}
          onClick={() => onSelect(id, name)}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-cta-lg)] hover:-translate-y-0.5 transition-all active:translate-y-0 cursor-pointer"
        >
          Daftar Sekarang
        </button>
      </div>
    </div>
  )
}