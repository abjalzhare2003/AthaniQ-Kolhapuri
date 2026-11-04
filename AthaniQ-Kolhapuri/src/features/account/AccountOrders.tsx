import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { getOrdersByCustomer } from '@/data/demoOrders'
import { EmptyState } from '@/components/ui/EmptyState'
import { OrderRow } from './OrderRow'

export function AccountOrders() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const orders = user ? getOrdersByCustomer(user.id) : []

  return (
    <section aria-labelledby="orders-title">
      <h1 id="orders-title" className="mb-4 font-serif text-2xl font-semibold text-brand-700">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" message="When you place an order, it will show up here." action={{ label: 'Start Shopping', onClick: () => navigate('/shop') }} />
      ) : (
        <div className="space-y-3">{orders.map((o) => <OrderRow key={o.id} order={o} />)}</div>
      )}
    </section>
  )
}
