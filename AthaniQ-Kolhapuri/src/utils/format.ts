/**
 * Formatting utilities for display across the application.
 * All currency is displayed in Indian Rupees (₹).
 */

const CURRENCY = '₹'

/** Format a number as Indian Rupees without decimals (e.g. ₹1,299). */
export function formatCurrency(amount: number, includeSymbol = true): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount)
  return includeSymbol ? `${CURRENCY}${formatted}` : formatted
}

/** Format a number as Indian Rupees with decimals (e.g. ₹1,299.00). */
export function formatCurrencyDecimal(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${CURRENCY}${formatted}`
}

/** Format a date as e.g. "12 Jan 2025". */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Format a date with time. */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Format a date as ISO short e.g. "2025-01-12". */
export function formatDateISO(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0] ?? ''
}

/** Calculate discount percentage from original and current price. */
export function discountPercent(original: number, current: number): number | null {
  if (original <= 0 || current >= original) return null
  return Math.round(((original - current) / original) * 100)
}

/** Truncate text with ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

/** Format a number with grouping (e.g. 1,234). */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}

/** Generate a demo order reference like AK-R-2025-001234. */
export function generateOrderRef(prefix: 'R' | 'W', id: number): string {
  return `AK-${prefix}-2025-${String(id).padStart(6, '0')}`
}
