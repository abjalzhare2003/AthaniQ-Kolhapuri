import type { ReturnRequest } from '@/types'

/**
 * Sample return requests for the admin portal and customer account.
 */

export const demoReturns: ReturnRequest[] = [
  {
    id: 'ret-001',
    returnRef: 'AK-RET-2025-000001',
    orderId: 'order-001',
    orderRef: 'AK-R-2025-000001',
    customerId: 'cust-001',
    customerName: 'Aarav Sharma',
    items: [
      { productId: 'p-acc-002', name: 'Kolhapuri Leather Wallet', quantity: 1 },
    ],
    reason: 'Wrong colour received',
    status: 'completed',
    notes: 'Replacement dispatched.',
    createdAt: '2025-10-22T10:00:00Z',
  },
  {
    id: 'ret-002',
    returnRef: 'AK-RET-2025-000002',
    orderId: 'order-002',
    orderRef: 'AK-R-2025-000002',
    customerId: 'cust-003',
    customerName: 'Raja Pawar',
    items: [
      { productId: 'p-women-001', name: 'Peacock Embossed Women\'s Kolhapuri', quantity: 1 },
    ],
    reason: 'Size does not fit',
    status: 'approved',
    notes: 'Awaiting courier pickup.',
    createdAt: '2025-11-02T09:00:00Z',
  },
  {
    id: 'ret-003',
    returnRef: 'AK-RET-2025-000003',
    orderId: 'order-005',
    orderRef: 'AK-R-2025-000004',
    customerId: 'cust-004',
    customerName: 'Neha Joshi',
    items: [
      { productId: 'p-acc-001', name: 'Braided Leather Belt', quantity: 1 },
    ],
    reason: 'Changed mind',
    status: 'requested',
    createdAt: '2025-11-02T12:00:00Z',
  },
]
