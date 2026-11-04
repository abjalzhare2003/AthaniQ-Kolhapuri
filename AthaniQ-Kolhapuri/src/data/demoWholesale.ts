import type { WholesaleApplication, WholesaleQuote } from '@/types'

/**
 * Sample wholesale applications and quotes for demonstration.
 * The demo customer 'wholesale@athaniq.com' (cust-002) is linked
 * to an approved application so the wholesale flow can be tested.
 */

export const demoWholesaleApplications: WholesaleApplication[] = [
  {
    id: 'wapp-001',
    businessName: 'Shree Footwear Mart',
    contactName: 'Priya Desai',
    email: 'wholesale@athaniq.com',
    phone: '+91 98123 45678',
    businessType: 'retailer',
    address: 'Shree Footwear Mart, Lane 3',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411002',
    gstNumber: '27ABCDE1234F1Z5',
    status: 'approved',
    createdAt: '2025-09-01T10:00:00Z',
    reviewedAt: '2025-09-03T14:00:00Z',
    linkedCustomerId: 'cust-002',
  },
  {
    id: 'wapp-002',
    businessName: 'Kolhapur Leather Co.',
    contactName: 'Sandeep Patil',
    email: 'sandeep@kolhapurleather.com',
    phone: '+91 91234 56789',
    businessType: 'distributor',
    address: 'Plot 22, Industrial Estate',
    city: 'Kolhapur',
    state: 'Maharashtra',
    pincode: '416001',
    status: 'pending',
    createdAt: '2025-10-25T09:00:00Z',
  },
  {
    id: 'wapp-003',
    businessName: 'Mumbai Boutique House',
    contactName: 'Anita Kulkarni',
    email: 'anita@mumbaiboutique.in',
    phone: '+91 99887 76655',
    businessType: 'boutique',
    address: 'Bandra Linking Road, Shop 18',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    status: 'pending',
    createdAt: '2025-10-30T12:00:00Z',
  },
  {
    id: 'wapp-004',
    businessName: 'Nashik Footwear Traders',
    contactName: 'Mahesh Shinde',
    email: 'mahesh@nashikfootwear.com',
    phone: '+91 90909 80808',
    businessType: 'retailer',
    address: 'Main Road, Shop 56',
    city: 'Nashik',
    state: 'Maharashtra',
    pincode: '422001',
    gstNumber: '27XYZAB5678C1Z2',
    status: 'rejected',
    rejectionReason: 'Unable to verify business registration. Please reapply with valid GST certificate.',
    createdAt: '2025-09-10T11:00:00Z',
    reviewedAt: '2025-09-15T10:00:00Z',
  },
  {
    id: 'wapp-005',
    businessName: 'Aurangabad Style Store',
    contactName: 'Rahul Joshi',
    email: 'rahul@aurangabadstyle.com',
    phone: '+91 93322 11445',
    businessType: 'online_store',
    address: 'Garkhedi, Shop 3',
    city: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    pincode: '431001',
    status: 'info_required',
    notes: 'Please provide a copy of your business registration certificate and GST number.',
    createdAt: '2025-10-28T15:00:00Z',
  },
]

export const demoQuotes: WholesaleQuote[] = [
  {
    id: 'quote-001',
    quoteRef: 'AK-Q-2025-000001',
    customerId: 'cust-002',
    customerName: 'Priya Desai',
    items: [
      {
        productId: 'p-men-001',
        name: 'Classic Tan Kolhapuri Chappal',
        slug: 'classic-tan-kolhapuri-chappal-men',
        image: '',
        variantId: 'AK-M-CTK-8-v',
        size: '8',
        color: 'Tan',
        quantity: 48,
        unitPrice: 620,
        lineTotal: 29760,
      },
    ],
    total: 29760,
    status: 'submitted',
    notes: 'Required before December festival season.',
    createdAt: '2025-10-20T10:00:00Z',
  },
  {
    id: 'quote-002',
    quoteRef: 'AK-Q-2025-000002',
    customerId: 'cust-002',
    customerName: 'Priya Desai',
    items: [
      {
        productId: 'p-women-001',
        name: 'Peacock Embossed Women\'s Kolhapuri',
        slug: 'peacock-embossed-womens-kolhapuri',
        image: '',
        variantId: 'AK-W-PEK-RG-5-v',
        size: '5',
        color: 'Rose Gold',
        quantity: 24,
        unitPrice: 875,
        lineTotal: 21000,
      },
      {
        productId: 'p-acc-001',
        name: 'Braided Leather Belt',
        slug: 'braided-leather-belt',
        image: '',
        variantId: 'AK-A-BLB-T-32-v',
        size: '32',
        color: 'Tan',
        quantity: 12,
        unitPrice: 499,
        lineTotal: 5988,
      },
    ],
    total: 26988,
    status: 'accepted',
    createdAt: '2025-10-10T09:00:00Z',
  },
]

export function getApplicationByEmail(email: string): WholesaleApplication | undefined {
  return demoWholesaleApplications.find((a) => a.email.toLowerCase() === email.toLowerCase())
}

export function getApplicationsByStatus(status: WholesaleApplication['status']): WholesaleApplication[] {
  return demoWholesaleApplications.filter((a) => a.status === status)
}

export function getQuotesByCustomer(customerId: string): WholesaleQuote[] {
  return demoQuotes.filter((q) => q.customerId === customerId)
}
