import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateFinalPrice(basePrice: number, discountRate: number): number {
  return basePrice * (1 - discountRate)
}

export function formatDiscountDisplay(
  basePrice: number,
  discountRate: number
): { original: string; final: string; hasDiscount: boolean } {
  if (discountRate === 0) {
    return { original: '', final: formatCurrency(basePrice), hasDiscount: false }
  }
  if (discountRate >= 1) {
    return { original: formatCurrency(basePrice), final: 'Gratis', hasDiscount: true }
  }
  return {
    original: formatCurrency(basePrice),
    final: formatCurrency(calculateFinalPrice(basePrice, discountRate)),
    hasDiscount: true,
  }
}