/**
 * Central mutable demo data store with localStorage persistence.
 * Acts as the "in-memory database" for the AthaniQ Kolhapuri platform frontend.
 * Admin edits, order creation, review moderation, stock adjustments, and wholesale
 * approvals mutate this state and persist to localStorage, keeping the buyer-facing
 * storefront and admin panel in sync.
 *
 * In production, this layer is replaced by REST APIs to Java Spring Boot / MySQL.
 */

import { products as initialProducts, setProductsProvider } from '@/data/products'
import { categories as initialCategories } from '@/data/categories'
import { demoOrders as initialOrders } from '@/data/demoOrders'
import {
  demoWholesaleApplications as initialApplications,
  demoQuotes as initialQuotes,
} from '@/data/demoWholesale'
import { demoPayments as initialPayments } from '@/data/demoPayments'
import { demoReturns as initialReturns } from '@/data/demoReturns'
import { demoCoupons as initialCoupons } from '@/data/demoCoupons'
import { demoCustomers as initialCustomers } from '@/data/demoCustomers'
import { demoReviews as initialReviews } from '@/data/demoReviews'
import type {
  Product,
  Category,
  Order,
  OrderStatus,
  WholesaleApplication,
  WholesaleQuote,
  Payment,
  ReturnRequest,
  Coupon,
  InventoryAdjustment,
  Review,
  ReviewStatus,
} from '@/types'

const STORAGE_KEY = 'athaniq_demo_data_v2'

interface AppData {
  products: Product[]
  categories: Category[]
  orders: Order[]
  wholesaleApplications: WholesaleApplication[]
  quotes: WholesaleQuote[]
  payments: Payment[]
  returns: ReturnRequest[]
  coupons: Coupon[]
  customers: typeof initialCustomers
  inventoryAdjustments: InventoryAdjustment[]
  reviews: Review[]
}

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function createInitialData(): AppData {
  return {
    products: clone(initialProducts),
    categories: clone(initialCategories),
    orders: clone(initialOrders),
    wholesaleApplications: clone(initialApplications),
    quotes: clone(initialQuotes),
    payments: clone(initialPayments),
    returns: clone(initialReturns),
    coupons: clone(initialCoupons),
    customers: clone(initialCustomers),
    inventoryAdjustments: [],
    reviews: clone(initialReviews),
  }
}

function loadData(): AppData {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createInitialData()
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const init = createInitialData()
      saveData(init)
      return init
    }
    const parsed = JSON.parse(raw) as Partial<AppData>
    // Ensure all arrays exist even if schema evolved
    const merged: AppData = {
      products: parsed.products && parsed.products.length > 0 ? parsed.products : clone(initialProducts),
      categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : clone(initialCategories),
      orders: parsed.orders && parsed.orders.length > 0 ? parsed.orders : clone(initialOrders),
      wholesaleApplications: parsed.wholesaleApplications && parsed.wholesaleApplications.length > 0 ? parsed.wholesaleApplications : clone(initialApplications),
      quotes: parsed.quotes ?? clone(initialQuotes),
      payments: parsed.payments && parsed.payments.length > 0 ? parsed.payments : clone(initialPayments),
      returns: parsed.returns && parsed.returns.length > 0 ? parsed.returns : clone(initialReturns),
      coupons: parsed.coupons && parsed.coupons.length > 0 ? parsed.coupons : clone(initialCoupons),
      customers: parsed.customers && parsed.customers.length > 0 ? parsed.customers : clone(initialCustomers),
      inventoryAdjustments: parsed.inventoryAdjustments ?? [],
      reviews: parsed.reviews && parsed.reviews.length > 0 ? parsed.reviews : clone(initialReviews),
    }
    return merged
  } catch (err) {
    console.error('Failed to parse demo data from localStorage, falling back to defaults:', err)
    return createInitialData()
  }
}

function saveData(d: AppData): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
    } catch (err) {
      console.error('Failed to save demo data to localStorage:', err)
    }
  }
  notifyListeners()
}

type Listener = () => void
const listeners = new Set<Listener>()

export function subscribeToDataStore(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notifyListeners(): void {
  listeners.forEach((l) => {
    try {
      l()
    } catch (e) {
      console.error('Error in datastore listener:', e)
    }
  })
}

let data: AppData = loadData()

/** Reset all demo data to initial defaults and clear localStorage. */
export function resetDemoData(): void {
  data = createInitialData()
  saveData(data)
}

// ─── Products ───────────────────────────────────────────────────

export function getProducts(): Product[] {
  return data.products
}

// Register dynamic provider for storefront helper functions
setProductsProvider(getProducts)

export function getProductById(id: string): Product | undefined {
  return data.products.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return data.products.find((p) => p.slug === slug)
}

export function setProducts(products: Product[]): void {
  data.products = products
  saveData(data)
}

export function upsertProduct(product: Product): void {
  const idx = data.products.findIndex((p) => p.id === product.id)
  if (idx >= 0) {
    data.products[idx] = product
  } else {
    data.products.unshift(product)
  }
  saveData(data)
}

export function deleteProduct(id: string): void {
  data.products = data.products.filter((p) => p.id !== id)
  saveData(data)
}

// ─── Categories ─────────────────────────────────────────────────

export function getCategories(): Category[] {
  return data.categories
}

export function getCategoryById(id: string): Category | undefined {
  return data.categories.find((c) => c.id === id)
}

export function upsertCategory(category: Category): void {
  const idx = data.categories.findIndex((c) => c.id === category.id)
  if (idx >= 0) {
    data.categories[idx] = category
  } else {
    data.categories.push(category)
  }
  saveData(data)
}

export function deleteCategory(id: string): void {
  data.categories = data.categories.filter((c) => c.id !== id)
  saveData(data)
}

// ─── Orders ─────────────────────────────────────────────────────

export function getOrders(): Order[] {
  return data.orders
}

export function getOrderById(id: string): Order | undefined {
  return data.orders.find((o) => o.id === id)
}

export function getOrdersByStatus(status: OrderStatus | OrderStatus[]): Order[] {
  const statuses = Array.isArray(status) ? status : [status]
  return data.orders.filter((o) => statuses.includes(o.status))
}

export function addOrder(order: Order): void {
  data.orders.unshift(order)
  saveData(data)
}

export function updateOrder(id: string, updates: Partial<Order>): void {
  const idx = data.orders.findIndex((o) => o.id === id)
  if (idx >= 0) {
    const existing = data.orders[idx]!
    data.orders[idx] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    saveData(data)
  }
}

/**
 * Update an order's status with status history auditing and optional shipment details.
 */
export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  options?: {
    note?: string
    actor?: string
    courierName?: string
    trackingRef?: string
    dispatchDate?: string
    estimatedDelivery?: string
  },
): Order | undefined {
  const idx = data.orders.findIndex((o) => o.id === orderId)
  if (idx < 0) return undefined

  const order = data.orders[idx]!
  const previousStatus = order.status
  const historyItem = {
    id: `hist-${Date.now()}`,
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: options?.note || `Status changed from ${previousStatus} to ${newStatus}`,
    actor: options?.actor || 'Admin',
  }

  const history = order.statusHistory ? [...order.statusHistory, historyItem] : [historyItem]

  const updates: Partial<Order> = {
    status: newStatus,
    statusHistory: history,
    updatedAt: new Date().toISOString(),
  }

  if (options?.courierName) updates.courierName = options.courierName
  if (options?.trackingRef) updates.trackingRef = options.trackingRef
  if (options?.dispatchDate) updates.dispatchDate = options.dispatchDate
  if (options?.estimatedDelivery) updates.estimatedDelivery = options.estimatedDelivery

  // Automatic fulfillment sync
  if (newStatus === 'shipped') {
    updates.fulfillmentStatus = 'shipped'
  } else if (newStatus === 'delivered') {
    updates.fulfillmentStatus = 'delivered'
  } else if (newStatus === 'processing' || newStatus === 'confirmed') {
    updates.fulfillmentStatus = 'processing'
  }

  data.orders[idx] = { ...order, ...updates }
  saveData(data)
  return data.orders[idx]
}

// ─── Customer Reviews ───────────────────────────────────────────

export function getReviews(): Review[] {
  return data.reviews
}

export function getReviewsByProduct(productId: string, onlyApproved = true): Review[] {
  return data.reviews.filter((r) => {
    if (r.productId !== productId) return false
    if (onlyApproved && r.status !== 'approved') return false
    return true
  })
}

export function addReview(review: Review): void {
  data.reviews.unshift(review)
  recalculateProductRating(review.productId)
  saveData(data)
}

export function updateReview(id: string, updates: Partial<Review>): void {
  const idx = data.reviews.findIndex((r) => r.id === id)
  if (idx >= 0) {
    data.reviews[idx] = { ...data.reviews[idx]!, ...updates, updatedAt: new Date().toISOString() }
    recalculateProductRating(data.reviews[idx]!.productId)
    saveData(data)
  }
}

export function updateReviewStatus(
  id: string,
  status: ReviewStatus,
  moderationNote?: string,
): void {
  const idx = data.reviews.findIndex((r) => r.id === id)
  if (idx >= 0) {
    const existing = data.reviews[idx]!
    data.reviews[idx] = {
      ...existing,
      status,
      moderationNote: moderationNote !== undefined ? moderationNote : existing.moderationNote,
      updatedAt: new Date().toISOString(),
    }
    recalculateProductRating(existing.productId)
    saveData(data)
  }
}

export function deleteReview(id: string): void {
  const rev = data.reviews.find((r) => r.id === id)
  data.reviews = data.reviews.filter((r) => r.id !== id)
  if (rev) {
    recalculateProductRating(rev.productId)
  }
  saveData(data)
}

function recalculateProductRating(productId: string): void {
  const approved = data.reviews.filter((r) => r.productId === productId && r.status === 'approved')
  const prod = data.products.find((p) => p.id === productId)
  if (prod) {
    if (approved.length === 0) {
      prod.rating = 0
      prod.reviewCount = 0
    } else {
      const sum = approved.reduce((acc, r) => acc + r.rating, 0)
      prod.rating = Number((sum / approved.length).toFixed(1))
      prod.reviewCount = approved.length
    }
  }
}

// ─── Wholesale ──────────────────────────────────────────────────

export function getWholesaleApplications(): WholesaleApplication[] {
  return data.wholesaleApplications
}

export function updateWholesaleApplication(
  id: string,
  updates: Partial<WholesaleApplication>,
): void {
  const idx = data.wholesaleApplications.findIndex((a) => a.id === id)
  if (idx >= 0) {
    data.wholesaleApplications[idx] = { ...data.wholesaleApplications[idx]!, ...updates }
    saveData(data)
  }
}

export function addWholesaleApplication(app: WholesaleApplication): void {
  data.wholesaleApplications.unshift(app)
  saveData(data)
}

export function getApplicationByEmail(email: string): WholesaleApplication | undefined {
  return data.wholesaleApplications.find((a) => a.email.toLowerCase() === email.toLowerCase())
}

export function getQuotes(): WholesaleQuote[] {
  return data.quotes
}

export function addQuote(quote: WholesaleQuote): void {
  data.quotes.unshift(quote)
  saveData(data)
}

// ─── Payments & Returns ─────────────────────────────────────────

export function getPayments(): Payment[] {
  return data.payments
}

export function addPayment(payment: Payment): void {
  data.payments.unshift(payment)
  saveData(data)
}

export function getReturns(): ReturnRequest[] {
  return data.returns
}

export function updateReturn(id: string, updates: Partial<ReturnRequest>): void {
  const idx = data.returns.findIndex((r) => r.id === id)
  if (idx >= 0) {
    data.returns[idx] = { ...data.returns[idx]!, ...updates }
    saveData(data)
  }
}

export function addReturn(ret: ReturnRequest): void {
  data.returns.unshift(ret)
  saveData(data)
}

// ─── Coupons ────────────────────────────────────────────────────

export function getCoupons(): Coupon[] {
  return data.coupons
}

export function updateCoupon(id: string, updates: Partial<Coupon>): void {
  const idx = data.coupons.findIndex((c) => c.id === id)
  if (idx >= 0) {
    data.coupons[idx] = { ...data.coupons[idx]!, ...updates }
    saveData(data)
  }
}

export function addCoupon(coupon: Coupon): void {
  data.coupons.push(coupon)
  saveData(data)
}

export function deleteCoupon(id: string): void {
  data.coupons = data.coupons.filter((c) => c.id !== id)
  saveData(data)
}

// ─── Customers ──────────────────────────────────────────────────

export function getCustomers(): typeof initialCustomers {
  return data.customers
}

export function getCustomerById(id: string) {
  return data.customers.find((c) => c.id === id)
}

// ─── Inventory ──────────────────────────────────────────────────

export function getInventoryAdjustments(): InventoryAdjustment[] {
  return data.inventoryAdjustments
}

export function addInventoryAdjustment(adj: InventoryAdjustment): void {
  data.inventoryAdjustments.unshift(adj)
  saveData(data)
}

export function updateVariantStock(
  productId: string,
  variantId: string,
  newStock: number,
  reason: string,
): void {
  const product = data.products.find((p) => p.id === productId)
  if (!product) return
  const variant = product.variants.find((v) => v.id === variantId)
  if (!variant) return

  const previousStock = variant.stock
  variant.stock = Math.max(0, Math.floor(newStock))

  data.inventoryAdjustments.unshift({
    id: `adj-${Date.now()}`,
    variantId,
    productId,
    productName: product.name,
    sku: variant.sku,
    previousStock,
    newStock: variant.stock,
    reason,
    createdAt: new Date().toISOString(),
  })
  saveData(data)
}
