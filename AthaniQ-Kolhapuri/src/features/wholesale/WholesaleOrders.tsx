import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { getOrdersByCustomer } from '@/data/demoOrders'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function WholesaleOrders() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const orders = user ? getOrdersByCustomer(user.id).filter((o) => o.type === 'wholesale') : []

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Wholesale', to: '/wholesale/dashboard' }, { label: 'Orders' }]} />
      <h1 className="heading-serif text-2xl font-bold mb-4">Wholesale Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No wholesale orders" message="Browse the catalogue to place your first bulk order." action={{ label: 'Browse Catalogue', onClick: () => navigate('/wholesale/catalog') }} />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} to={`/wholesale/orders/${o.id}`} className="card p-4 block hover:shadow-card transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><div className="font-medium text-charcoal">{o.orderRef}</div><div className="text-xs text-muted">{formatDate(o.createdAt)} · {o.items.length} items</div></div>
                <div className="flex items-center gap-3"><OrderStatusBadge status={o.status} /><PaymentStatusBadge status={o.paymentStatus} /><span className="font-medium">{formatCurrency(o.total)}</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
