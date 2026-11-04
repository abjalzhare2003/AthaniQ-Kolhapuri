import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '@/services/dataStore'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function WholesaleOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const order = orderId ? getOrderById(orderId) : undefined

  if (!order) {
    return <div className="text-center py-8"><p className="text-muted">Order not found.</p><Link to="/wholesale/orders" className="btn btn-primary mt-4 inline-flex">Back to Orders</Link></div>
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Wholesale', to: '/wholesale/dashboard' }, { label: 'Orders', to: '/wholesale/orders' }, { label: order.orderRef }]} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h2 className="heading-serif text-xl font-semibold">{order.orderRef}</h2><p className="text-sm text-muted">Placed on {formatDate(order.createdAt)}</p></div>
        <div className="flex items-center gap-2"><OrderStatusBadge status={order.status} /><PaymentStatusBadge status={order.paymentStatus} /></div>
      </div>

      <div className="card p-6">
        <h3 className="heading-serif text-lg font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.variantId} className="flex items-center justify-between border-b border-muted-border pb-3 last:border-0">
              <Link to={`/wholesale/product/${item.slug}`} className="flex items-center gap-3">
                <img src={item.image || ''} alt="" className="h-12 w-12 rounded object-cover bg-muted-bg" />
                <div><div className="font-medium text-charcoal hover:text-brand">{item.name}</div><div className="text-xs text-muted">{item.size} · {item.color} × {item.quantity} @ {formatCurrency(item.price)}/unit</div></div>
              </Link>
              <span className="font-medium">{formatCurrency(item.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm border-t border-muted-border pt-4">
          <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-2">Shipping & Payment</h3>
        <div className="text-sm text-muted space-y-1">
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p>Delivery: {order.deliveryMethod}</p>
          <p>Payment: {order.paymentMethod} ({order.paymentStatus})</p>
        </div>
      </div>
    </div>
  )
}
