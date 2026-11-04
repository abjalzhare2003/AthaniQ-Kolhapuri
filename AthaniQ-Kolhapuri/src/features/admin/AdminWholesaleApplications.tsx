import { useState } from 'react'
import { Search } from 'lucide-react'
import { getWholesaleApplications, updateWholesaleApplication } from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { WholesaleStatusBadge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { Textarea, Button, Select } from '@/components/ui/Input'
import { formatDate } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import type { WholesaleApplicationStatus } from '@/types'

export function AdminWholesaleApplications() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<WholesaleApplicationStatus | 'all'>('all')
  const [selected, setSelected] = useState<typeof applications[0] | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [, forceRender] = useState(0)

  const applications = getWholesaleApplications()
    .filter((a) => !search || a.businessName.toLowerCase().includes(search.toLowerCase()) || a.contactName.toLowerCase().includes(search.toLowerCase()))
    .filter((a) => statusFilter === 'all' || a.status === statusFilter)

  const handleApprove = (id: string) => {
    updateWholesaleApplication(id, { status: 'approved', reviewedAt: new Date().toISOString() })
    forceRender((n) => n + 1)
    toast('success', 'Application approved')
  }

  const handleReject = () => {
    if (!selected) return
    updateWholesaleApplication(selected.id, { status: 'rejected', rejectionReason: rejectReason, reviewedAt: new Date().toISOString() })
    setSelected(null)
    setRejectReason('')
    forceRender((n) => n + 1)
    toast('success', 'Application rejected')
  }

  return (
    <div>
      <AdminPageHeader title="Wholesale Applications" description="Review and approve wholesale business applications" />
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-muted-border flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications…" className="input-base pl-9" /></div>
          <div className="w-40"><Select name="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as WholesaleApplicationStatus | 'all')}><option value="all">All Statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="info_required">Info Required</option></Select></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted-bg border-b border-muted-border"><tr>{['Business', 'Contact', 'Type', 'Date', 'Status', 'Action'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-muted-border">
              {applications.map((a) => (
                <tr key={a.id} className="hover:bg-muted-bg/50">
                  <td className="px-4 py-3"><div className="font-medium text-sm">{a.businessName}</div><div className="text-xs text-muted">{a.city}, {a.state}</div></td>
                  <td className="px-4 py-3 text-sm">{a.contactName}<div className="text-xs text-muted">{a.email}</div></td>
                  <td className="px-4 py-3 text-sm capitalize">{a.businessType.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-sm text-muted">{formatDate(a.createdAt)}</td>
                  <td className="px-4 py-3"><WholesaleStatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    {a.status === 'pending' ? (
                      <div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleApprove(a.id)}>Approve</Button><Button variant="ghost" size="sm" onClick={() => { setSelected(a); setRejectReason('') }}>Reject</Button></div>
                    ) : <Button variant="ghost" size="sm" onClick={() => setSelected(a)}>View</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && <p className="p-6 text-center text-sm text-muted">No applications found.</p>}
        </div>
      </div>

      {/* Detail/Reject dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} title={selected?.status === 'pending' ? 'Review Application' : 'Application Details'} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><span className="text-muted">Business:</span> <strong>{selected.businessName}</strong></div>
              <div><span className="text-muted">Contact:</span> <strong>{selected.contactName}</strong></div>
              <div><span className="text-muted">Email:</span> <strong>{selected.email}</strong></div>
              <div><span className="text-muted">Phone:</span> <strong>{selected.phone}</strong></div>
              <div><span className="text-muted">Type:</span> <strong className="capitalize">{selected.businessType.replace('_', ' ')}</strong></div>
              <div><span className="text-muted">GST:</span> <strong>{selected.gstNumber ?? '—'}</strong></div>
              <div><span className="text-muted">Address:</span> <strong>{selected.address}</strong></div>
              <div><span className="text-muted">City:</span> <strong>{selected.city}, {selected.state} - {selected.pincode}</strong></div>
            </div>
            {selected.notes && <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700"><strong>Note:</strong> {selected.notes}</div>}
            {selected.rejectionReason && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700"><strong>Rejection reason:</strong> {selected.rejectionReason}</div>}
            {selected.status === 'pending' && (
              <>
                <Textarea label="Rejection Reason (optional)" name="reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Explain why the application is rejected…" />
                <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button><Button variant="danger" onClick={handleReject}>Reject</Button><Button onClick={() => { handleApprove(selected.id); setSelected(null) }}>Approve</Button></div>
              </>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}
