import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { demoReturns } from '@/data/demoReturns'
import { formatDate } from '@/utils/format'
import { EmptyState } from '@/components/ui/EmptyState'

const statusColors: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-700',
  processing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
}

export function AccountReturns() {
  const { user } = useAuthStore()
  const returns = user ? demoReturns.filter((r) => r.customerId === user.id) : []

  if (returns.length === 0) {
    return <EmptyState icon={RotateCcw} title="No return requests" message="You haven't requested any returns yet." />
  }

  return (
    <div className="space-y-3">
      <h2 className="heading-serif text-lg font-semibold mb-2">Return Requests</h2>
      {returns.map((ret) => (
        <div key={ret.id} className="card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-medium text-charcoal">{ret.returnRef}</div>
              <div className="text-xs text-muted">{formatDate(ret.createdAt)} · {ret.items.length} items · Reason: {ret.reason}</div>
            </div>
            <span className={`badge ${statusColors[ret.status] ?? ''} capitalize`}>{ret.status}</span>
          </div>
          {ret.notes && <p className="mt-2 text-sm text-muted">Notes: {ret.notes}</p>}
          <Link to={`/account/orders/${ret.orderId}`} className="mt-2 inline-flex text-sm text-brand hover:text-brand-600">View order →</Link>
        </div>
      ))}
    </div>
  )
}
