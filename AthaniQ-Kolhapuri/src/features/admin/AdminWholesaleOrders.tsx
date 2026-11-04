import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { getOrders } from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { formatCurrency, formatDate } from '@/utils/format'
import type { OrderStatus } from '@/types'

export function AdminWholesaleOrders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const orders = getOrders()
    .filter((o) => o.type === 'wholesale')
    .filter((o) => !search || o.orderRef.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()))
    .filter((o) => statusFilter === 'all' || o.status === statusFilter)

  return (
    <div>
      <AdminPageHeader title="Wholesale Orders" description="Manage bulk orders from wholesale partners" />
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-muted-border flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search wholesale orders…" className="input-base pl-9" /></div>
          <div className="w-40"><Select name="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}><option value="all">All Statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></Select></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted-bg border-b border-muted-border"><tr>{['Order Ref', 'Business', 'Date', 'Items', 'Total', 'Status', 'Payment'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-muted-border">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-muted-bg/50">
                  <td className="px-4 py-3"><Link to={`/admin/orders/${o.id}`} className="font-medium text-brand hover:text-brand-600 text-sm">{o.orderRef}</Link></td>
                  <td className="px-4 py-3 text-sm">{o.customerName}</td>
                  <td className="px-4 py-3 text-sm text-muted">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-muted">{o.items.length}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={o.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="p-6 text-center text-sm text-muted">No wholesale orders found.</p>}
        </div>
      </div>
    </div>
  )
}
