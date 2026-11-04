import type { Coupon } from '@/types'

/**
 * Sample coupon codes for demo.
 * Coupon validation in the cart/checkout is simulated — the backend
 * must validate and apply discounts in production.
 */

export const demoCoupons: Coupon[] = [
  {
    id: 'coupon-001',
    code: 'WELCOME10',
    description: '10% off your first order',
    type: 'percentage',
    value: 10,
    minOrderValue: 0,
    validFrom: '2025-01-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    active: true,
    usageCount: 142,
  },
  {
    id: 'coupon-002',
    code: 'FESTIVE500',
    description: '₹500 off orders above ₹3,000',
    type: 'fixed',
    value: 500,
    minOrderValue: 3000,
    validFrom: '2025-10-01T00:00:00Z',
    validUntil: '2025-12-31T23:59:59Z',
    active: true,
    usageCount: 58,
  },
  {
    id: 'coupon-003',
    code: 'KOLHAPUR15',
    description: '15% off orders above ₹2,000',
    type: 'percentage',
    value: 15,
    minOrderValue: 2000,
    validFrom: '2025-06-01T00:00:00Z',
    validUntil: '2025-11-30T23:59:59Z',
    active: false,
    usageCount: 301,
  },
]

export function findCoupon(code: string): Coupon | undefined {
  return demoCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase())
}
