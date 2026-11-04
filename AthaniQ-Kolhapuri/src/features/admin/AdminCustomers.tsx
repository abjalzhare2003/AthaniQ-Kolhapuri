import { useState } from 'react'
import { Search } from 'lucide-react'
import { getCustomers } from '@/services/dataStore'
import { getOrdersByCustomer } from '@/data/demoOrders'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { formatCurrency } from '@/utils/format'

export function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof customers[0] | null>(null)

  const customers = getCustomers()
    .filter((c) => !search || c.email.toLowerCase().includes(search.toLowerCase()) || `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <AdminPageHeader title="Customers" description="Manage retail and wholesale customer accounts" />
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-muted-border"><div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…" className="input-base pl-9" /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted-bg border-b border-muted-border"><tr>{['Name', 'Email', 'Phone', 'Type', 'Orders', 'Total Spent'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-muted-border">
              {customers.map((c) => {
                const orders = getOrdersByCustomer(c.id)
                const total = orders.reduce((sum, o) => sum + o.total, 0)
                return (
                  <tr key={c.id} className="hover:bg-muted-bg/50 cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="px-4 py-3 text-sm font-medium">{c.firstName} {c.lastName}</td>
                    <td className="px-4 py-3 text-sm text-muted">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-muted">{c.phone ?? '—'}</td>
                    <td className="px-4 py-3"><Badge variant={c.role === 'wholesale' ? 'accent' : 'default'}>{c.role}</Badge></td>
                    <td className="px-4 py-3 text-sm text-muted">{orders.length}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(total)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)} title="Customer Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><span className="text-muted">Name:</span> <strong>{selected.firstName} {selected.lastName}</strong></div>
              <div><span className="text-muted">Email:</span> <strong>{selected.email}</strong></div>
              <div><span className="text-muted">Phone:</span> <strong>{selected.phone ?? '—'}</strong></div>
              <div><span className="text-muted">Type:</span> <strong className="capitalize">{selected.role}</strong></div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Addresses</h3>
              <div className="space-y-2">
                {selected.addresses.map((a) => (
                  <div key={a.id} className="rounded-lg border border-muted-border p-3 text-sm">
                    <div className="font-medium">{a.label}{a.isDefault && ' (Default)'}</div>
                    <div className="text-muted">{a.fullName}, {a.line1}, {a.city}, {a.state} - {a.pincode}</div>
                    <div className="text-muted">{a.phone}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Order History</h3>
              {(() => { const orders = getOrdersByCustomer(selected.id); return orders.length === 0 ? <p className="text-sm text-muted">No orders.</p> : (
                <div className="space-y-2">
                  {orders.map((o) => <div key={o.id} className="flex justify-between rounded-lg border border-muted-border p-3 text-sm"><div><span className="font-medium">{o.orderRef}</span><span className="text-muted ml-2">{o.type}</span></div><span className="font-medium">{formatCurrency(o.total)}</span></div>)}
                </div>
              )})()}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
