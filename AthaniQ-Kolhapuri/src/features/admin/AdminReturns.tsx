import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { getReturns, updateReturn } from '@/services/dataStore'
import { Button } from '@/components/ui/Input'
import { formatDate } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import { cn } from '@/utils/cn'
import type { ReturnStatus } from '@/types'

const statusColors: Record<ReturnStatus, string> = {
  requested: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-700',
  processing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
}

export function AdminReturns() {
  const returns = getReturns()

  const handleUpdate = (id: string, status: ReturnStatus) => {
    updateReturn(id, { status })
    toast('success', `Return ${status}`)
  }

  return (
    <div>
      <AdminPageHeader title="Returns" description="Manage customer return requests" />
      <div className="space-y-3">
        {returns.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div><div className="font-medium text-charcoal">{r.returnRef}</div><div className="text-xs text-muted">{formatDate(r.createdAt)} · Order: {r.orderRef} · {r.customerName}</div></div>
              <span className={cn('badge capitalize', statusColors[r.status])}>{r.status}</span>
            </div>
            <div className="mb-3">
              <p className="text-sm"><span className="text-muted">Items:</span> {r.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</p>
              <p className="text-sm"><span className="text-muted">Reason:</span> {r.reason}</p>
              {r.notes && <p className="text-sm text-muted mt-1">Notes: {r.notes}</p>}
            </div>
            {r.status === 'requested' && (
              <div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => handleUpdate(r.id, 'approved')}>Approve</Button><Button variant="ghost" size="sm" onClick={() => handleUpdate(r.id, 'rejected')}>Reject</Button></div>
            )}
            {r.status === 'approved' && <Button variant="ghost" size="sm" onClick={() => handleUpdate(r.id, 'processing')}>Mark Processing</Button>}
            {r.status === 'processing' && <Button variant="ghost" size="sm" onClick={() => handleUpdate(r.id, 'completed')}>Mark Completed</Button>}
          </div>
        ))}
        {returns.length === 0 && <p className="text-center text-sm text-muted py-8">No return requests.</p>}
      </div>
    </div>
  )
}
