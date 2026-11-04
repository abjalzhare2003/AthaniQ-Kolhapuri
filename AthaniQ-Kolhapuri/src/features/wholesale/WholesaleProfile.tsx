import { useAuthStore } from '@/stores/authStore'
import { getApplicationByEmail } from '@/services/dataStore'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { WholesaleStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/format'

export function WholesaleProfile() {
  const { user } = useAuthStore()
  const application = user ? getApplicationByEmail(user.email) : undefined

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Wholesale', to: '/wholesale/dashboard' }, { label: 'Profile' }]} />
      <h1 className="heading-serif text-2xl font-bold mb-4">Business Profile</h1>
      {application ? (
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="heading-serif text-lg font-semibold">{application.businessName}</h2>
              <WholesaleStatusBadge status={application.status} />
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><span className="text-muted">Contact:</span> <strong>{application.contactName}</strong></div>
              <div><span className="text-muted">Email:</span> <strong>{application.email}</strong></div>
              <div><span className="text-muted">Phone:</span> <strong>{application.phone}</strong></div>
              <div><span className="text-muted">Type:</span> <strong className="capitalize">{application.businessType.replace('_', ' ')}</strong></div>
              <div><span className="text-muted">Address:</span> <strong>{application.address}</strong></div>
              <div><span className="text-muted">City:</span> <strong>{application.city}, {application.state} - {application.pincode}</strong></div>
              {application.gstNumber && <div><span className="text-muted">GST:</span> <strong>{application.gstNumber}</strong></div>}
              <div><span className="text-muted">Approved:</span> <strong>{application.reviewedAt ? formatDate(application.reviewedAt) : '—'}</strong></div>
            </div>
          </div>
          <p className="text-xs text-muted italic">[Business profile editing requires backend integration. Contact support to update details.]</p>
        </div>
      ) : (
        <div className="card p-6 text-center">
          <p className="text-muted">No wholesale application found for this account.</p>
        </div>
      )}
    </div>
  )
}
