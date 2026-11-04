import { Link } from 'react-router-dom'
import { Package, RotateCcw, Heart, Bell } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { getOrdersByCustomer } from '@/data/demoOrders'
import { demoReturns } from '@/data/demoReturns'
import { OrderRow } from './OrderRow'

export function AccountOverview() {
  const { user } = useAuthStore()
  const { wishlist } = useCartStore()
  const orders = user ? getOrdersByCustomer(user.id) : []
  const returns = user ? demoReturns.filter((r) => r.customerId === user.id) : []
  const recentOrders = orders.slice(0, 4)

  const stats = [
    { label: 'Orders', value: orders.length, icon: Package, to: '/account/orders' },
    { label: 'Active returns', value: returns.filter((r) => r.status !== 'completed').length, icon: RotateCcw, to: '/account/returns' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, to: '/account/wishlist' },
    { label: 'Notifications', value: 3, icon: Bell, to: '/account/notifications' },
  ]

  return (
    <div className="space-y-6">
      <section aria-labelledby="orders-heading">
        <div className="mb-4 flex items-end justify-between">
          <h1 id="orders-heading" className="font-serif text-2xl font-semibold text-brand-700">My Orders</h1>
          <Link to="/account/orders" className="text-sm font-medium text-brand hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-muted-border p-8 text-center text-sm text-muted">No orders yet. <Link to="/shop" className="font-medium text-brand underline">Start shopping</Link></p>
        ) : (
          <div className="space-y-3">{recentOrders.map((o) => <OrderRow key={o.id} order={o} />)}</div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="rounded-xl border border-muted-border bg-ivory-50 p-4 transition-shadow hover:shadow-card">
            <s.icon className="mb-2 h-5 w-5 text-accent-500" strokeWidth={1.7} />
            <div className="text-2xl font-bold text-brand-700">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-muted-border bg-ivory-50 p-5" aria-labelledby="details-heading">
        <h2 id="details-heading" className="font-serif text-lg font-semibold text-brand-700">Account details</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-xs text-muted">Name</dt><dd className="font-medium">{user?.firstName} {user?.lastName}</dd></div>
          <div><dt className="text-xs text-muted">Email</dt><dd className="font-medium">{user?.email}</dd></div>
          <div><dt className="text-xs text-muted">Phone</dt><dd className="font-medium">{user?.phone ?? '—'}</dd></div>
          <div><dt className="text-xs text-muted">Account type</dt><dd className="font-medium capitalize">{user?.role}</dd></div>
        </dl>
        <Link to="/account/profile" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">Edit profile</Link>
      </section>
    </div>
  )
}
