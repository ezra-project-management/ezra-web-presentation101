import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Kenyan Shilling — consistent label across Ezra web & admin (`KSh 1,800`). */
export function formatCurrency(amount: number): string {
  const n = Math.round(amount)
  return `KSh ${n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}
