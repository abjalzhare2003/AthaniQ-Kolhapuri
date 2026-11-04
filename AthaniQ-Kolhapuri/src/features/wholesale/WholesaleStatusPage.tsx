import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Input, Button } from '@/components/ui/Input'
import { WholesaleStatusBadge } from '@/components/ui/Badge'
import { getApplicationByEmail } from '@/services/dataStore'
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'

export function WholesaleStatusPage() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<'found' | 'not_found' | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      const app = getApplicationByEmail(email)
      setResult(app ? 'found' : 'not_found')
      setLoading(false)
    }, 500)
  }

  const application = email ? getApplicationByEmail(email) : undefined

  const stateConfig = {
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', title: 'Application Under Review', message: 'Our team is reviewing your application. You will be notified once a decision is made (typically within 2–3 business days).' },
    approved: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', title: 'Application Approved!', message: 'Congratulations! You can now access the wholesale catalogue and start placing bulk orders.' },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', title: 'Application Rejected', message: 'Unfortunately, your application was not approved at this time. See the reason below or reapply with updated information.' },
    info_required: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100', title: 'Additional Information Required', message: 'We need more details to complete your application review. Please contact us with the requested information.' },
  }

  return (
    <div className="container-narrow py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wholesale', to: '/wholesale' }, { label: 'Status' }]} />
      <h1 className="heading-serif text-3xl font-bold">Application Status</h1>
      <p className="mt-2 text-muted">Enter your registered email to check the status of your wholesale application.</p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row sm:max-w-md">
        <Input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@business.com" />
        <Button type="submit" loading={loading}>Check Status</Button>
      </form>

      <p className="mt-2 text-xs text-muted">Try: wholesale@athaniq.com (approved), sandeep@kolhapurleather.com (pending), mahesh@nashikfootwear.com (rejected), rahul@aurangabadstyle.com (info required)</p>

      {result === 'not_found' && (
        <div className="mt-6 card p-6 text-center">
          <p className="text-muted">No application found for <strong>{email}</strong>.</p>
          <Link to="/wholesale/register" className="btn btn-primary mt-4 inline-flex">Apply Now</Link>
        </div>
      )}

      {result === 'found' && application && (
        <div className="mt-6 space-y-4">
          {(() => {
            const cfg = stateConfig[application.status]
            return (
              <div className={`card p-6 flex items-start gap-4 border-l-4 ${
                application.status === 'pending' ? 'border-l-amber-500' :
                application.status === 'approved' ? 'border-l-green-500' :
                application.status === 'rejected' ? 'border-l-red-500' : 'border-l-blue-500'
              }`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${cfg.bg} flex-shrink-0`}>
                  <cfg.icon className={`h-6 w-6 ${cfg.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="heading-serif text-xl font-semibold">{cfg.title}</h2>
                    <WholesaleStatusBadge status={application.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted">{cfg.message}</p>
                  {application.rejectionReason && (
                    <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><strong>Reason:</strong> {application.rejectionReason}</p>
                  )}
                  {application.notes && (
                    <p className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700"><strong>Note:</strong> {application.notes}</p>
                  )}
                </div>
              </div>
            )
          })()}

          <div className="card p-6">
            <h3 className="font-semibold mb-3">Application Details</h3>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><span className="text-muted">Business:</span> <strong>{application.businessName}</strong></div>
              <div><span className="text-muted">Contact:</span> <strong>{application.contactName}</strong></div>
              <div><span className="text-muted">Email:</span> <strong>{application.email}</strong></div>
              <div><span className="text-muted">Type:</span> <strong className="capitalize">{application.businessType.replace('_', ' ')}</strong></div>
              <div><span className="text-muted">City:</span> <strong>{application.city}, {application.state}</strong></div>
              <div><span className="text-muted">Submitted:</span> <strong>{new Date(application.createdAt).toLocaleDateString('en-IN')}</strong></div>
            </div>
          </div>

          {application.status === 'approved' && (
            <Link to="/wholesale/catalog" className="btn btn-primary w-full">Access Wholesale Catalogue →</Link>
          )}
          {application.status === 'rejected' && (
            <Link to="/wholesale/register" className="btn btn-outline w-full">Reapply with Updated Information</Link>
          )}
        </div>
      )}
    </div>
  )
}
