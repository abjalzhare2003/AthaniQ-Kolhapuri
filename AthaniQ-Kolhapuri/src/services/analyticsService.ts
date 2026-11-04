import {
  getOrders,
  getProducts,
  getWholesaleApplications,
  getReturns,
  getReviews,
} from './dataStore'
import type { Order, OrderStatus, PaymentStatus, Review } from '@/types'

/**
 * Analytics service — derives dashboard metrics from the underlying
 * dataStore records rather than hardcoded numbers.
 * Labelled as demo metrics in UI.
 */

export interface DashboardMetrics {
  totalSales: number
  orderCount: number
  newOrderCount: number
  ongoingOrderCount: number
  dispatchedOrderCount: number
  deliveredOrderCount: number
  cancelledOrderCount: number
  retailOrderCount: number
  wholesaleOrderCount: number
  retailSales: number
  wholesaleSales: number
  averageOrderValue: number
  pendingApplications: number
  pendingReturns: number
  pendingReviewsCount: number
  lowStockProducts: { id: string; name: string; stock: number; variantId: string; sku: string; color: string; size: string }[]
  outOfStockProducts: { id: string; name: string; stock: number; variantId: string; sku: string; color: string; size: string }[]
  recentOrders: Order[]
  recentReviews: Review[]
}

function isCountedOrder(order: Order): boolean {
  return order.paymentStatus !== 'refunded' && order.status !== 'cancelled'
}

export function getDashboardMetrics(): DashboardMetrics {
  const orders = getOrders()
  const products = getProducts()
  const applications = getWholesaleApplications()
  const returns = getReturns()
  const reviews = getReviews()

  const counted = orders.filter(isCountedOrder)
  const totalSales = counted.reduce((sum, o) => sum + o.total, 0)

  const retailOrders = counted.filter((o) => o.type === 'retail')
  const wholesaleOrders = counted.filter((o) => o.type === 'wholesale')
  const retailSales = retailOrders.reduce((sum, o) => sum + o.total, 0)
  const wholesaleSales = wholesaleOrders.reduce((sum, o) => sum + o.total, 0)

  const averageOrderValue = counted.length > 0 ? Math.round(totalSales / counted.length) : 0

  const lowStockProducts: DashboardMetrics['lowStockProducts'] = []
  const outOfStockProducts: DashboardMetrics['outOfStockProducts'] = []

  for (const product of products) {
    for (const variant of product.variants) {
      if (variant.stock === 0) {
        outOfStockProducts.push({
          id: product.id,
          name: product.name,
          stock: variant.stock,
          variantId: variant.id,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
        })
      } else if (variant.stock <= 5) {
        lowStockProducts.push({
          id: product.id,
          name: product.name,
          stock: variant.stock,
          variantId: variant.id,
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
        })
      }
    }
  }

  return {
    totalSales,
    orderCount: orders.length,
    newOrderCount: orders.filter((o) => o.status === 'pending').length,
    ongoingOrderCount: orders.filter((o) => o.status === 'confirmed' || o.status === 'processing').length,
    dispatchedOrderCount: orders.filter((o) => o.status === 'shipped').length,
    deliveredOrderCount: orders.filter((o) => o.status === 'delivered').length,
    cancelledOrderCount: orders.filter((o) => o.status === 'cancelled').length,
    retailOrderCount: orders.filter((o) => o.type === 'retail').length,
    wholesaleOrderCount: orders.filter((o) => o.type === 'wholesale').length,
    retailSales,
    wholesaleSales,
    averageOrderValue,
    pendingApplications: applications.filter((a) => a.status === 'pending').length,
    pendingReturns: returns.filter((r) => r.status === 'requested' || r.status === 'approved').length,
    pendingReviewsCount: reviews.filter((r) => r.status === 'pending').length,
    lowStockProducts: lowStockProducts.sort((a, b) => a.stock - b.stock),
    outOfStockProducts,
    recentOrders: [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6),
    recentReviews: [...reviews]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4),
  }
}

/** Configurable sales trend by month/period. */
export function getSalesTrend(months = 6): { month: string; retail: number; wholesale: number; total: number }[] {
  const orders = getOrders().filter(isCountedOrder)
  const now = new Date()
  const result: { month: string; retail: number; wholesale: number; total: number }[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthLabel = d.toLocaleDateString('en-IN', { month: 'short' })
    const monthOrders = orders.filter((o) => {
      const od = new Date(o.createdAt)
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear()
    })
    const retail = monthOrders.filter((o) => o.type === 'retail').reduce((s, o) => s + o.total, 0)
    const wholesale = monthOrders.filter((o) => o.type === 'wholesale').reduce((s, o) => s + o.total, 0)
    result.push({
      month: monthLabel,
      retail,
      wholesale,
      total: retail + wholesale,
    })
  }

  return result
}

export function getOrderStatusDistribution(): { status: OrderStatus; count: number }[] {
  const orders = getOrders()
  const statuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
  ]
  return statuses.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }))
}

export function getPaymentStatusDistribution(): { status: PaymentStatus; count: number; amount: number }[] {
  const orders = getOrders()
  const statuses: PaymentStatus[] = ['pending', 'paid', 'refunded', 'failed']
  return statuses.map((status) => ({
    status,
    count: orders.filter((o) => o.paymentStatus === status).length,
    amount: orders.filter((o) => o.paymentStatus === status).reduce((s, o) => s + o.total, 0),
  }))
}

export function getProductPerformance(): {
  productId: string
  name: string
  unitsSold: number
  revenue: number
}[] {
  const orders = getOrders().filter(isCountedOrder)
  const productMap = new Map<string, { productId: string; name: string; unitsSold: number; revenue: number }>()

  for (const order of orders) {
    for (const item of order.items) {
      const existing = productMap.get(item.productId)
      if (existing) {
        existing.unitsSold += item.quantity
        existing.revenue += item.lineTotal
      } else {
        productMap.set(item.productId, {
          productId: item.productId,
          name: item.name,
          unitsSold: item.quantity,
          revenue: item.lineTotal,
        })
      }
    }
  }

  return Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue)
}
