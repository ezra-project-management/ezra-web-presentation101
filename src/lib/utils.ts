import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount)
}

/** Public-facing price line for service cards and booking (avoids “KES 0”). */
export function formatServicePrice(amount: number): string {
  if (!amount || amount <= 0) return 'Pricing when you book'
  return `From ${formatCurrency(amount)}`
}
