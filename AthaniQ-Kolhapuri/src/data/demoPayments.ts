import type { Payment } from '@/types'

/**
 * Sample payment records for the admin portal.
 * These are SIMULATED records — no real payment gateway is involved.
 */

export const demoPayments: Payment[] = [
  {
    id: 'pay-001',
    orderId: 'order-001',
    orderRef: 'AK-R-2025-000001',
    customerName: 'Aarav Sharma',
    amount: 2513,
    method: 'Cash on Delivery',
    status: 'paid',
    transactionRef: 'COD-0001',
    createdAt: '2025-10-20T14:00:00Z',
  },
  {
    id: 'pay-002',
    orderId: 'order-002',
    orderRef: 'AK-R-2025-000002',
    customerName: 'Raja Pawar',
    amount: 1794,
    method: 'UPI',
    status: 'paid',
    transactionRef: 'UPI-TRN-2025-0002',
    createdAt: '2025-11-01T09:20:00Z',
  },
  {
    id: 'pay-003',
    orderId: 'order-003',
    orderRef: 'AK-R-2025-000003',
    customerName: 'Aarav Sharma',
    amount: 1568,
    method: 'Credit Card',
    status: 'paid',
    transactionRef: 'CC-TRN-2025-0003',
    createdAt: '2025-11-01T17:00:00Z',
  },
  {
    id: 'pay-004',
    orderId: 'order-004',
    orderRef: 'AK-W-2025-000001',
    customerName: 'Priya Desai',
    amount: 44832,
    method: 'Bank Transfer (Net 30)',
    status: 'pending',
    createdAt: '2025-10-29T10:00:00Z',
  },
  {
    id: 'pay-005',
    orderId: 'order-005',
    orderRef: 'AK-R-2025-000004',
    customerName: 'Neha Joshi',
    amount: 3589,
    method: 'Cash on Delivery',
    status: 'pending',
    createdAt: '2025-11-02T08:30:00Z',
  },
  {
    id: 'pay-006',
    orderId: 'order-006',
    orderRef: 'AK-R-2025-000005',
    customerName: 'Raja Pawar',
    amount: 1359,
    method: 'UPI',
    status: 'refunded',
    transactionRef: 'UPI-REF-2025-0005',
    createdAt: '2025-09-22T10:00:00Z',
  },
]
