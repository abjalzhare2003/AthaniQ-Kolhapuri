/**
 * Domain entity types for AthaniQ Kolhapuri e-commerce platform.
 */

// ─── Categories ──────────────────────────────────────────────

export type CategorySlug = 'men' | 'women' | 'kids' | 'accessories'

export interface Category {
  id: string
  name: string
  slug: CategorySlug
  description: string
  image: string
  active: boolean
}

// ─── Products ────────────────────────────────────────────────

export type ProductStatus = 'active' | 'draft'
export type ProductType = 'retail' | 'wholesale'

export interface ProductVariant {
  id: string
  productId: string
  size: string
  color: string
  sku: string
  stock: number
  /** Retail price override for this variant (size-based pricing). Falls back to product price if undefined. */
  price?: number
  /** Wholesale price override for this variant. */
  wholesalePrice?: number
  /** Whether this variant is active and available. Defaults to true. */
  active?: boolean
  /** Optional variant-specific image URL. */
  image?: string
}

export interface WholesaleTier {
  minQty: number
  maxQty: number | null
  price: number
}

export interface Product {
  id: string
  name: string
  slug: string
  categoryId: string
  description: string
  careInstructions: string
  materials: string
  /** Retail price in ₹. */
  price: number
  /** Original (pre-discount) price if the product is on sale. */
  originalPrice?: number
  images: string[]
  variants: ProductVariant[]
  status: ProductStatus
  /** True if product is available for wholesale buyers. */
  wholesaleEnabled: boolean
  /** Wholesale base price (per unit at lowest tier). */
  wholesalePrice?: number
  /** Minimum order quantity for wholesale. */
  moq?: number
  /** Quantity-based price tiers for wholesale. */
  wholesaleTiers?: WholesaleTier[]
  /** Size guide notes. */
  sizeGuide?: string
  featured: boolean
  bestseller: boolean
  newArrival: boolean
  rating: number
  reviewCount: number
  createdAt: string
}

// ─── Cart ─────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  variantId: string
  name: string
  image: string
  slug: string
  size: string
  color: string
  price: number
  quantity: number
}

export interface Cart {
  items: CartItem[]
}

// ─── Wishlist ─────────────────────────────────────────────────

export interface WishlistItem {
  productId: string
  addedAt: string
}

// ─── Users / Auth ─────────────────────────────────────────────

export type UserRole = 'customer' | 'wholesale' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  avatar?: string
}

export interface Address {
  id: string
  label: string
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  phone: string
  isDefault: boolean
}

// ─── Orders ───────────────────────────────────────────────────

export type OrderType = 'retail' | 'wholesale'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'
export type FulfillmentStatus = 'unfulfilled' | 'processing' | 'shipped' | 'delivered'

export interface OrderStatusHistoryItem {
  id: string
  status: OrderStatus
  timestamp: string
  note?: string
  actor?: string
}

export interface OrderItem {
  productId: string
  name: string
  slug: string
  image: string
  variantId: string
  size: string
  color: string
  price: number
  quantity: number
  lineTotal: number
}

export interface Order {
  id: string
  orderRef: string
  type: OrderType
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  shippingAddress: Address
  billingAddress?: Address
  deliveryMethod: string
  paymentMethod: string
  trackingRef?: string
  courierName?: string
  dispatchDate?: string
  estimatedDelivery?: string
  statusHistory?: OrderStatusHistoryItem[]
  notes?: string
  createdAt: string
  updatedAt: string
}

// ─── Reviews ──────────────────────────────────────────────────

export type ReviewStatus = 'approved' | 'pending' | 'hidden' | 'flagged'

export interface Review {
  id: string
  productId: string
  productName: string
  productImage: string
  customerName: string
  customerEmail?: string
  rating: number
  title?: string
  comment: string
  status: ReviewStatus
  createdAt: string
  updatedAt?: string
  verifiedPurchase?: boolean
  helpfulCount?: number
  moderationNote?: string
}

// ─── Wholesale ────────────────────────────────────────────────

export type WholesaleApplicationStatus = 'pending' | 'approved' | 'rejected' | 'info_required'
export type BusinessType = 'retailer' | 'distributor' | 'boutique' | 'online_store' | 'other'

export interface WholesaleApplication {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  businessType: BusinessType
  address: string
  city: string
  state: string
  pincode: string
  gstNumber?: string
  status: WholesaleApplicationStatus
  rejectionReason?: string
  notes?: string
  createdAt: string
  reviewedAt?: string
  linkedCustomerId?: string
}

export interface WholesaleQuoteItem {
  productId: string
  name: string
  slug: string
  image: string
  variantId: string
  size: string
  color: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface WholesaleQuote {
  id: string
  quoteRef: string
  customerId: string
  customerName: string
  items: WholesaleQuoteItem[]
  total: number
  status: 'draft' | 'submitted' | 'reviewing' | 'accepted' | 'rejected'
  notes?: string
  createdAt: string
}

// ─── Payments ────────────────────────────────────────────────

export interface Payment {
  id: string
  orderId: string
  orderRef: string
  customerName: string
  amount: number
  method: string
  status: PaymentStatus
  transactionRef?: string
  createdAt: string
}

// ─── Returns ──────────────────────────────────────────────────

export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'processing' | 'completed'

export interface ReturnRequest {
  id: string
  returnRef: string
  orderId: string
  orderRef: string
  customerId: string
  customerName: string
  items: { productId: string; name: string; quantity: number }[]
  reason: string
  status: ReturnStatus
  notes?: string
  createdAt: string
}

// ─── Coupons ──────────────────────────────────────────────────

export type CouponType = 'percentage' | 'fixed'

export interface Coupon {
  id: string
  code: string
  description: string
  type: CouponType
  value: number
  minOrderValue: number
  validFrom: string
  validUntil: string
  active: boolean
  usageCount: number
}

// ─── Inventory ───────────────────────────────────────────────

export interface InventoryAdjustment {
  id: string
  variantId: string
  productId: string
  productName: string
  sku?: string
  previousStock: number
  newStock: number
  reason: string
  createdAt: string
}

// ─── Notifications ────────────────────────────────────────────

export interface AppNotification {
  id: string
  type: 'order' | 'promo' | 'system' | 'wholesale'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

// ─── Content ─────────────────────────────────────────────────

export interface SiteContent {
  hero: {
    headline: string
    subheadline: string
    ctaText: string
    image: string
  }
  announcement: {
    enabled: boolean
    text: string
  }
  promoBanner: {
    enabled: boolean
    headline: string
    text: string
    ctaText: string
    image: string
  }
  brandStory: {
    title: string
    body: string
    image: string
  }
  benefits: { icon: string; title: string; description: string }[]
  testimonials: { name: string; role: string; quote: string }[]
  newsletter: {
    enabled: boolean
    headline: string
    text: string
  }
}
