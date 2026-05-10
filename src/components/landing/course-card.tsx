'use client'

import { useState } from 'react'
import { Monitor, Users, Globe, ChevronDown } from 'lucide-react'
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

const modeIcons: Record<ModeAvailable, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  online: Monitor,
  offline: Users,
  both: Globe,
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
  isFeatured?: boolean
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
  isFeatured,
}: CourseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const finalPrice = calculateFinalPrice(basePrice, discountRate)
  const hasDiscount = discountRate > 0 && discountRate < 1
  const isFree = discountRate >= 1
  const ModeIcon = modeIcons[modeAvailable]
  const descriptionLong = description.length > 100

  return (
    <div
      data-testid={`course-card-${id}`}
      className={`bg-[var(--color-bg-surface)] rounded-[20px] border h-full flex flex-col ${
        isFeatured
          ? 'border-[var(--color-primary)] shadow-[0_4px_24px_rgba(183,110,121,0.25)] ring-1 ring-[var(--color-primary)]/20'
          : 'border-[var(--color-border)] shadow-[0_2px_12px_rgba(183,110,121,0.08)]'
      } hover:shadow-[0_4px_20px_rgba(183,110,121,0.15)] transition-all duration-200`}
    >
      {isFeatured && (
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-center text-xs font-semibold py-1.5 tracking-wide shadow-[0_2px_8px_rgba(183,110,121,0.3)] rounded-t-[20px]">
          &#9733; Paling Populer &#9733;
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-display font-bold text-xl text-[var(--color-text-primary)]">
            {name}
          </h4>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border inline-flex items-center gap-1 ${modeBadges[modeAvailable]}`}
          >
            <ModeIcon className="w-3 h-3" strokeWidth={1.5} />
            {modeLabels[modeAvailable]}
          </span>
        </div>

        <div className={`relative ${descriptionLong && !expanded ? 'max-h-20 overflow-hidden' : ''}`}>
          <p className="text-sm text-[var(--color-text-secondary)] mb-1 leading-relaxed">
            {description}
          </p>
          {descriptionLong && !expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--color-bg-surface)] to-transparent" />
          )}
        </div>

        {descriptionLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[var(--color-text-accent)] hover:text-[var(--color-primary-dark)] flex items-center gap-1 mb-3 transition-colors cursor-pointer self-start"
          >
            {expanded ? 'Ciutkan' : 'Baca selengkapnya'}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} strokeWidth={2} />
          </button>
        )}

        <div className="flex items-center gap-2 mb-4 text-sm text-[var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
            {numberOfSessions} pertemuan
          </span>
        </div>

        <div data-testid={`price-display-${id}`}>
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
      </div>

      <div className="px-6 pb-6 pt-0">
        <button
          data-testid={`course-cta-${id}`}
          onClick={() => onSelect(id, name)}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-full text-sm font-semibold shadow-[var(--shadow-cta)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-cta-lg)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all active:translate-y-0 cursor-pointer"
        >
          Daftar Sekarang
        </button>
      </div>
    </div>
  )
}
