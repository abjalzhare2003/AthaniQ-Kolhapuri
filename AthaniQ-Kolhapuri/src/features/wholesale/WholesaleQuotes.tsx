import { FileText } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { getQuotesByCustomer } from '@/data/demoWholesale'
import { formatCurrency, formatDate } from '@/utils/format'
import { EmptyState } from '@/components/ui/EmptyState'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function WholesaleQuotes() {
  const { user } = useAuthStore()
  const quotes = user ? getQuotesByCustomer(user.id) : []

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Wholesale', to: '/wholesale/dashboard' }, { label: 'Quote Requests' }]} />
      <h1 className="heading-serif text-2xl font-bold mb-4">Quote Requests</h1>
      {quotes.length === 0 ? (
        <EmptyState icon={FileText} title="No quote requests" message="Request a quotation from any wholesale product page." />
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <div key={q.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><div className="font-medium text-charcoal">{q.quoteRef}</div><div className="text-xs text-muted">{formatDate(q.createdAt)} · {q.items.length} items</div></div>
                <div className="flex items-center gap-3">
                  <span className={`badge capitalize ${q.status === 'accepted' ? 'bg-green-100 text-green-800' : q.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>{q.status}</span>
                  <span className="font-medium">{formatCurrency(q.total)}</span>
                </div>
              </div>
              {q.notes && <p className="mt-2 text-sm text-muted">Notes: {q.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
