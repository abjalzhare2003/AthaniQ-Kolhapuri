import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { getPayments } from '@/services/dataStore'
import { PaymentStatusBadge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/utils/format'

export function AdminPayments() {
  const payments = getPayments()
  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <AdminPageHeader title="Payments" description="View payment records. [All payments are simulated — no real gateway.]" />
      <div className="grid gap-4 sm:grid-cols-3 mb-4">
        <div className="card p-5"><div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div><div className="text-xs text-muted">Total Revenue (Paid)</div></div>
        <div className="card p-5"><div className="text-2xl font-bold text-amber-600">{formatCurrency(pendingAmount)}</div><div className="text-xs text-muted">Pending Payments</div></div>
        <div className="card p-5"><div className="text-2xl font-bold text-charcoal">{payments.length}</div><div className="text-xs text-muted">Total Transactions</div></div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted-bg border-b border-muted-border"><tr>{['Payment ID', 'Order', 'Customer', 'Amount', 'Method', 'Status', 'Date'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-muted-border">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-muted-bg/50">
                  <td className="px-4 py-3 text-sm font-medium">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-brand">{p.orderRef}</td>
                  <td className="px-4 py-3 text-sm">{p.customerName}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-sm text-muted">{p.method}</td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
