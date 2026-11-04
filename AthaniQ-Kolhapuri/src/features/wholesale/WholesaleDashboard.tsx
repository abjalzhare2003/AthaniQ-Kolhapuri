import { Link } from 'react-router-dom'
import { Package, ShoppingCart, FileText, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { getOrdersByCustomer } from '@/data/demoOrders'
import { getQuotesByCustomer } from '@/data/demoWholesale'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatusBadge } from '@/components/ui/Badge'

export function WholesaleDashboard() {
  const { user } = useAuthStore()
  const orders = user ? getOrdersByCustomer(user.id).filter((o) => o.type === 'wholesale') : []
  const quotes = user ? getQuotesByCustomer(user.id) : []
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Wholesale Orders', value: orders.length, icon: Package },
          { label: 'Active Quotes', value: quotes.length, icon: FileText },
          { label: 'Total Spent', value: formatCurrency(totalSpent), icon: TrendingUp },
          { label: 'Pending Orders', value: orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length, icon: ShoppingCart },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <stat.icon className="h-5 w-5 text-brand mb-2" />
            <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
            <div className="text-xs text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-serif text-lg font-semibold">Recent Orders</h2>
            <Link to="/wholesale/orders" className="text-sm text-brand hover:text-brand-600">View all →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-muted">No wholesale orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 4).map((o) => (
                <Link key={o.id} to={`/wholesale/orders/${o.id}`} className="flex items-center justify-between rounded-lg border border-muted-border p-3 hover:bg-muted-bg transition-colors">
                  <div><div className="text-sm font-medium">{o.orderRef}</div><div className="text-xs text-muted">{formatDate(o.createdAt)}</div></div>
                  <div className="flex items-center gap-2"><OrderStatusBadge status={o.status} /><span className="text-sm font-medium">{formatCurrency(o.total)}</span></div>
                </Link>
              ))}
            </div>
          )}
          <Link to="/wholesale/catalog" className="mt-3 btn btn-primary btn-sm w-full">Browse Catalogue & Place Order</Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-serif text-lg font-semibold">Quote Requests</h2>
            <Link to="/wholesale/quotes" className="text-sm text-brand hover:text-brand-600">View all →</Link>
          </div>
          {quotes.length === 0 ? (
            <p className="text-sm text-muted">No quote requests yet.</p>
          ) : (
            <div className="space-y-2">
              {quotes.map((q) => (
                <div key={q.id} className="flex items-center justify-between rounded-lg border border-muted-border p-3">
                  <div><div className="text-sm font-medium">{q.quoteRef}</div><div className="text-xs text-muted">{formatDate(q.createdAt)} · {q.items.length} items</div></div>
                  <span className={`badge capitalize ${q.status === 'accepted' ? 'bg-green-100 text-green-800' : q.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>{q.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
