import {
  addOrder,
  addPayment,
  getOrders,
  updateOrder,
} from './dataStore'
import type { Order, OrderItem, Address, CartItem } from '@/types'
import { generateOrderRef } from '@/utils/format'

/**
 * Order service — creates demo orders, updates statuses, etc.
 * In production, order creation must be handled by a backend that
 * validates inventory, recalculates prices, processes payments,
 * and manages fulfilment.
 */

let orderCounter = 100

export function createRetailOrder(params: {
  customerId: string
  customerName: string
  customerEmail: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  shippingAddress: Address
  billingAddress?: Address
  deliveryMethod: string
  paymentMethod: string
  couponCode?: string
  notes?: string
}): Order {
  orderCounter++
  const orderRef = generateOrderRef('R', orderCounter)
  const now = new Date().toISOString()

  const order: Order = {
    id: `order-${orderCounter}`,
    orderRef,
    type: 'retail',
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    items: params.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      variantId: item.variantId,
      size: item.size,
      color: item.color,
      price: item.price,
      quantity: item.quantity,
      lineTotal: item.price * item.quantity,
    })),
    subtotal: params.subtotal,
    discount: params.discount,
    shipping: params.shipping,
    tax: params.tax,
    total: params.total,
    status: 'pending',
    paymentStatus: params.paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
    fulfillmentStatus: 'unfulfilled',
    shippingAddress: params.shippingAddress,
    billingAddress: params.billingAddress,
    deliveryMethod: params.deliveryMethod,
    paymentMethod: params.paymentMethod,
    notes: params.notes,
    createdAt: now,
    updatedAt: now,
  }

  addOrder(order)

  // Create a corresponding demo payment record
  addPayment({
    id: `pay-${orderCounter}`,
    orderId: order.id,
    orderRef: order.orderRef,
    customerName: params.customerName,
    amount: params.total,
    method: params.paymentMethod,
    status: order.paymentStatus,
    transactionRef: params.paymentMethod !== 'Cash on Delivery' ? `DEMO-TRN-${orderRef}` : undefined,
    createdAt: now,
  })

  return order
}

export function createWholesaleOrder(params: {
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  total: number
  shippingAddress: Address
  deliveryMethod: string
  paymentMethod: string
  notes?: string
}): Order {
  orderCounter++
  const orderRef = generateOrderRef('W', orderCounter)
  const now = new Date().toISOString()

  const order: Order = {
    id: `order-${orderCounter}`,
    orderRef,
    type: 'wholesale',
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    items: params.items,
    subtotal: params.subtotal,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: params.total,
    status: 'confirmed',
    paymentStatus: 'pending',
    fulfillmentStatus: 'processing',
    shippingAddress: params.shippingAddress,
    deliveryMethod: params.deliveryMethod,
    paymentMethod: params.paymentMethod,
    notes: params.notes,
    createdAt: now,
    updatedAt: now,
  }

  addOrder(order)
  return order
}

export function updateOrderStatus(orderId: string, status: Order['status']): void {
  updateOrder(orderId, { status })
}

export function updateOrderPaymentStatus(orderId: string, status: Order['paymentStatus']): void {
  updateOrder(orderId, { paymentStatus: status })
}

export function updateOrderFulfillmentStatus(
  orderId: string,
  status: Order['fulfillmentStatus'],
  trackingRef?: string,
): void {
  updateOrder(orderId, { fulfillmentStatus: status, trackingRef })
}

export function getAllOrders(): Order[] {
  return getOrders()
}
