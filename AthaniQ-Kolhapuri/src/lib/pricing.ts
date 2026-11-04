import type { Product, WholesaleTier, CartItem } from '@/types'
import { siteConfig } from '@/config/site'

/**
 * Pricing calculation utilities.
 * These are reusable, tested utilities.
 * NOTE: In production, the backend must determine final prices, discounts, and totals.
 * Frontend calculations are for display only and must never be trusted for billing.
 */

/** Calculate the wholesale price for a given product at a given quantity. */
export function getWholesalePrice(product: Product, quantity: number): number {
  if (!product.wholesaleEnabled) return product.price
  if (!product.wholesaleTiers || product.wholesaleTiers.length === 0) {
    return product.wholesalePrice ?? product.price
  }

  const tier = product.wholesaleTiers
    .filter((t) => quantity >= t.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0]

  return tier?.price ?? product.wholesalePrice ?? product.price
}

/** Get the applicable tier for a quantity. */
export function getApplicableTier(tiers: WholesaleTier[], quantity: number): WholesaleTier | undefined {
  return [...tiers]
    .filter((t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty))
    .sort((a, b) => b.minQty - a.minQty)[0]
}

/** Check if quantity meets the minimum order quantity. */
export function meetsMoq(product: Product, quantity: number): boolean {
  return quantity >= (product.moq ?? 1)
}

/** Calculate the MOQ remainder — how many more units needed. */
export function moqRemaining(product: Product, quantity: number): number {
  const moq = product.moq ?? 1
  return Math.max(0, moq - quantity)
}

/** Calculate a wholesale line total. */
export function calculateWholesaleLineTotal(product: Product, quantity: number): number {
  const price = getWholesalePrice(product, quantity)
  return price * quantity
}

/** Calculate cart subtotal from cart items. */
export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/** Calculate shipping based on subtotal. */
export function calculateShipping(subtotal: number): number {
  if (subtotal === 0) return 0
  if (subtotal >= siteConfig.shipping.freeThreshold) return 0
  return siteConfig.shipping.flatRate
}

/** Calculate estimated tax. */
export function calculateTax(subtotal: number, discount = 0): number {
  return Math.round(Math.max(0, subtotal - discount) * siteConfig.shipping.estimatedTaxRate)
}

/** Calculate coupon discount. */
export function calculateCouponDiscount(
  subtotal: number,
  coupon: { type: 'percentage' | 'fixed'; value: number; minOrderValue: number } | null,
): number {
  if (!coupon) return 0
  if (subtotal < coupon.minOrderValue) return 0
  if (coupon.type === 'percentage') {
    return Math.round((subtotal * coupon.value) / 100)
  }
  return Math.min(coupon.value, subtotal)
}

/** Calculate cart totals given items and an optional coupon. */
export function calculateCartTotals(
  items: CartItem[],
  coupon: { type: 'percentage' | 'fixed'; value: number; minOrderValue: number } | null,
): {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
} {
  const subtotal = calculateCartSubtotal(items)
  const discount = calculateCouponDiscount(subtotal, coupon)
  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal, discount)
  const total = Math.max(0, subtotal - discount + shipping + tax)
  return { subtotal, discount, shipping, tax, total }
}
