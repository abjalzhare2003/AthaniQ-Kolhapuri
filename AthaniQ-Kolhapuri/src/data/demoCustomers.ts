import type { User, Address } from '@/types'

/**
 * Demo customer accounts for the frontend demo.
 * NOTE: These are NOT real accounts. Passwords are stored in plaintext
 * for demo purposes only. Production authentication must be handled
 * by a secure backend.
 */

export interface DemoCustomer extends User {
  password: string
  addresses: Address[]
}

export const demoCustomers: DemoCustomer[] = [
  {
    id: 'cust-001',
    email: 'demo@athaniq.com',
    password: 'demo123',
    firstName: 'Aarav',
    lastName: 'Sharma',
    role: 'customer',
    phone: '+91 98765 43210',
    addresses: [
      {
        id: 'addr-001',
        label: 'Home',
        fullName: 'Aarav Sharma',
        line1: '12, Shivaji Nagar',
        line2: 'Near Rajaram College',
        city: 'Kolhapur',
        state: 'Maharashtra',
        pincode: '416005',
        phone: '+91 98765 43210',
        isDefault: true,
      },
      {
        id: 'addr-002',
        label: 'Work',
        fullName: 'Aarav Sharma',
        line1: 'Office 45, MIDC',
        city: 'Kolhapur',
        state: 'Maharashtra',
        pincode: '416010',
        phone: '+91 98765 43210',
        isDefault: false,
      },
    ],
  },
  {
    id: 'cust-002',
    email: 'wholesale@athaniq.com',
    password: 'wholesale123',
    firstName: 'Priya',
    lastName: 'Desai',
    role: 'wholesale',
    phone: '+91 98123 45678',
    addresses: [
      {
        id: 'addr-003',
        label: 'Business',
        fullName: 'Priya Desai',
        line1: 'Shree Footwear Mart, Lane 3',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411002',
        phone: '+91 98123 45678',
        isDefault: true,
      },
    ],
  },
  {
    id: 'cust-003',
    email: 'raja.pawar@example.com',
    password: 'raja123',
    firstName: 'Raja',
    lastName: 'Pawar',
    role: 'customer',
    phone: '+91 90000 11111',
    addresses: [
      {
        id: 'addr-004',
        label: 'Home',
        fullName: 'Raja Pawar',
        line1: '78, Market Yard',
        city: 'Sangli',
        state: 'Maharashtra',
        pincode: '416416',
        phone: '+91 90000 11111',
        isDefault: true,
      },
    ],
  },
  {
    id: 'cust-004',
    email: 'neha.joshi@example.com',
    password: 'neha123',
    firstName: 'Neha',
    lastName: 'Joshi',
    role: 'customer',
    phone: '+91 91111 22222',
    addresses: [
      {
        id: 'addr-005',
        label: 'Home',
        fullName: 'Neha Joshi',
        line1: 'Flat 12, Green Residency',
        line2: 'FC Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411005',
        phone: '+91 91111 22222',
        isDefault: true,
      },
    ],
  },
]

export function findDemoCustomer(email: string, password: string): DemoCustomer | undefined {
  return demoCustomers.find((c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password)
}

export function getCustomerById(id: string): DemoCustomer | undefined {
  return demoCustomers.find((c) => c.id === id)
}
