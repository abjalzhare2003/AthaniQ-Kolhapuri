import { describe, it, expect, beforeEach } from 'vitest'
import {
  getProducts,
  upsertProduct,
  deleteProduct,
  updateVariantStock,
  getInventoryAdjustments,
  getOrders,
  addOrder,
  getOrderById,
  updateOrderStatus,
  getReviews,
  getReviewsByProduct,
  addReview,
  updateReviewStatus,
  deleteReview,
  getWholesaleApplications,
  updateWholesaleApplication,
  resetDemoData,
} from '@/services/dataStore'
import { getVariant } from '@/data/products'
import type { Order, Product, Review } from '@/types'

describe('AthaniQ Data Store & Admin Operations', () => {
  beforeEach(() => {
    resetDemoData()
  })

  describe('Product Management & Size-Based Variant Pricing', () => {
    it('creates a product with size-based prices and retrieves it', () => {
      const newProduct: Product = {
        id: 'p-test-001',
        name: 'Handcrafted Kolhapuri Artisan Special',
        slug: 'handcrafted-kolhapuri-artisan-special',
        categoryId: 'cat-men',
        description: 'Authentic Kolhapuri chappal with vegetable-tanned leather',
        careInstructions: 'Clean with damp cloth and apply oil',
        materials: 'Buff leather',
        price: 999, // Base price
        images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80'],
        variants: [
          {
            id: 'v-size-6',
            productId: 'p-test-001',
            size: '6',
            color: 'Tan',
            sku: 'AK-ART-6-TAN',
            price: 899, // Size 6 price
            stock: 12,
            active: true,
          },
          {
            id: 'v-size-7',
            productId: 'p-test-001',
            size: '7',
            color: 'Tan',
            sku: 'AK-ART-7-TAN',
            price: 949, // Size 7 price
            stock: 8,
            active: true,
          },
          {
            id: 'v-size-8',
            productId: 'p-test-001',
            size: '8',
            color: 'Tan',
            sku: 'AK-ART-8-TAN',
            price: 999, // Size 8 price
            stock: 5,
            active: true,
          },
        ],
        status: 'active',
        wholesaleEnabled: false,
        featured: true,
        bestseller: false,
        newArrival: true,
        rating: 5,
        reviewCount: 1,
        createdAt: new Date().toISOString(),
      }

      upsertProduct(newProduct)

      const products = getProducts()
      const found = products.find((p) => p.id === 'p-test-001')
      expect(found).toBeDefined()
      expect(found?.name).toBe('Handcrafted Kolhapuri Artisan Special')
      expect(found?.variants.length).toBe(3)

      // Test size-based pricing resolution
      const v6 = getVariant(found!, '6', 'Tan')
      const v7 = getVariant(found!, '7', 'Tan')
      const v8 = getVariant(found!, '8', 'Tan')

      expect(v6?.price).toBe(899)
      expect(v7?.price).toBe(949)
      expect(v8?.price).toBe(999)
    })

    it('updates product and safely deletes it', () => {
      const products = getProducts()
      const first = products[0]!
      const originalCount = products.length

      upsertProduct({
        ...first,
        name: 'Updated Name Classic',
      })

      expect(getProducts()[0]?.name).toBe('Updated Name Classic')

      deleteProduct(first.id)
      expect(getProducts().length).toBe(originalCount - 1)
      expect(getProducts().find((p) => p.id === first.id)).toBeUndefined()
    })
  })

  describe('Variant Inventory Management', () => {
    it('adjusts stock for a specific variant and logs an audit record', () => {
      const products = getProducts()
      const product = products[0]!
      const variant = product.variants[0]!
      const previousStock = variant.stock
      const targetStock = 25

      updateVariantStock(
        product.id,
        variant.id,
        targetStock,
        'Artisan workshop batch shipment received',
      )

      // Verify variant stock was updated
      const updatedProduct = getProducts().find((p) => p.id === product.id)
      const updatedVariant = updatedProduct?.variants.find((v) => v.id === variant.id)
      expect(updatedVariant?.stock).toBe(25)

      // Verify inventory adjustment audit record
      const adjustments = getInventoryAdjustments()
      expect(adjustments.length).toBeGreaterThan(0)
      const latest = adjustments[0]!
      expect(latest.productId).toBe(product.id)
      expect(latest.variantId).toBe(variant.id)
      expect(latest.previousStock).toBe(previousStock)
      expect(latest.newStock).toBe(25)
      expect(latest.reason).toBe('Artisan workshop batch shipment received')
    })

    it('prevents negative stock quantities', () => {
      const products = getProducts()
      const product = products[0]!
      const variant = product.variants[0]!

      updateVariantStock(product.id, variant.id, -10, 'Write-off error')

      const updated = getProducts().find((p) => p.id === product.id)
      const updatedVariant = updated?.variants.find((v) => v.id === variant.id)
      expect(updatedVariant?.stock).toBe(0)
    })
  })

  describe('Order Management & Price Snapshot Preservation', () => {
    it('preserves purchase-time snapshot price even if product price changes later', () => {
      const testOrder: Order = {
        id: 'ord-test-snapshot',
        orderRef: 'AK-TEST-999',
        type: 'retail',
        customerId: 'cust-001',
        customerName: 'Sanjay Shinde',
        customerEmail: 'sanjay@example.com',
        items: [
          {
            productId: 'p-men-001',
            name: 'Classic Tan Kolhapuri Chappal',
            slug: 'classic-tan-kolhapuri-chappal-men',
            image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1',
            variantId: 'AK-M-CTK-6-v',
            size: '6',
            color: 'Tan',
            price: 899, // Purchase-time price snapshot
            quantity: 2,
            lineTotal: 1798,
          },
        ],
        subtotal: 1798,
        discount: 0,
        shipping: 0,
        tax: 90,
        total: 1888,
        status: 'pending',
        paymentStatus: 'paid',
        fulfillmentStatus: 'unfulfilled',
        shippingAddress: {
          id: 'addr-1',
          label: 'Home',
          fullName: 'Sanjay Shinde',
          line1: '12 Shivaji Park',
          city: 'Kolhapur',
          state: 'Maharashtra',
          pincode: '416003',
          phone: '+91 98220 11223',
          isDefault: true,
        },
        deliveryMethod: 'Standard Courier',
        paymentMethod: 'UPI',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addOrder(testOrder)

      // Now change the current product catalogue price
      const product = getProducts().find((p) => p.id === 'p-men-001')!
      upsertProduct({
        ...product,
        price: 1999, // Increased catalog price
      })

      // The historical order snapshot price must NOT change!
      const retrievedOrder = getOrderById('ord-test-snapshot')
      expect(retrievedOrder).toBeDefined()
      expect(retrievedOrder?.items[0]?.price).toBe(899)
      expect(retrievedOrder?.total).toBe(1888)
    })

    it('updates order status to shipped with courier and tracking details', () => {
      const orders = getOrders()
      const order = orders[0]!

      updateOrderStatus(order.id, 'shipped', {
        courierName: 'Delhivery Logistics',
        trackingRef: 'DL987654321IN',
        dispatchDate: '2026-11-03T10:00:00Z',
        note: 'Handed over to courier hub in Kolhapur',
        actor: 'Admin Dispatcher',
      })

      const updated = getOrderById(order.id)!
      expect(updated.status).toBe('shipped')
      expect(updated.fulfillmentStatus).toBe('shipped')
      expect(updated.courierName).toBe('Delhivery Logistics')
      expect(updated.trackingRef).toBe('DL987654321IN')
      expect(updated.statusHistory).toBeDefined()
      expect(updated.statusHistory?.length).toBeGreaterThan(0)
      const lastHistory = updated.statusHistory![updated.statusHistory!.length - 1]!
      expect(lastHistory.status).toBe('shipped')
      expect(lastHistory.actor).toBe('Admin Dispatcher')
    })
  })

  describe('Customer Reviews Moderation', () => {
    it('adds customer review and calculates product rating', () => {
      const newReview: Review = {
        id: 'rev-test-1',
        productId: 'p-men-001',
        productName: 'Classic Tan Kolhapuri Chappal',
        productImage: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1',
        customerName: 'Gaurav K.',
        rating: 5,
        title: 'Outstanding quality and comfort',
        comment: 'Best traditional Kolhapuri footwear I have ever owned. Authentic leather.',
        status: 'pending',
        createdAt: new Date().toISOString(),
        verifiedPurchase: true,
      }

      addReview(newReview)

      const all = getReviews()
      expect(all.find((r) => r.id === 'rev-test-1')).toBeDefined()

      // Approve review
      updateReviewStatus('rev-test-1', 'approved')
      const approved = getReviewsByProduct('p-men-001', true)
      expect(approved.some((r) => r.id === 'rev-test-1')).toBe(true)

      // Hide review
      updateReviewStatus('rev-test-1', 'hidden', 'Filtered for test')
      const approvedAfterHide = getReviewsByProduct('p-men-001', true)
      expect(approvedAfterHide.some((r) => r.id === 'rev-test-1')).toBe(false)

      // Delete review
      deleteReview('rev-test-1')
      expect(getReviews().find((r) => r.id === 'rev-test-1')).toBeUndefined()
    })
  })

  describe('Wholesale Applications Workflow', () => {
    it('approves a pending wholesale application and updates reviewed status', () => {
      const apps = getWholesaleApplications()
      const pending = apps.find((a) => a.status === 'pending')!
      expect(pending).toBeDefined()

      updateWholesaleApplication(pending.id, {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
      })

      const updated = getWholesaleApplications().find((a) => a.id === pending.id)!
      expect(updated.status).toBe('approved')
      expect(updated.reviewedAt).toBeDefined()
    })

    it('rejects a wholesale application with rejection reason', () => {
      const apps = getWholesaleApplications()
      const app = apps[0]!

      updateWholesaleApplication(app.id, {
        status: 'rejected',
        rejectionReason: 'Invalid business GST certificate',
        reviewedAt: new Date().toISOString(),
      })

      const updated = getWholesaleApplications().find((a) => a.id === app.id)!
      expect(updated.status).toBe('rejected')
      expect(updated.rejectionReason).toBe('Invalid business GST certificate')
    })
  })
})
