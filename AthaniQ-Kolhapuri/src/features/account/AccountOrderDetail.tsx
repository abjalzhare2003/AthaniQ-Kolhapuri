import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '@/services/dataStore'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { OrderStatusBadge, PaymentStatusBadge, FulfillmentStatusBadge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function AccountOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const order = orderId ? getOrderById(orderId) : undefined

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-muted">Order not found.</p>
        <Link to="/account/orders" className="btn btn-primary mt-4 inline-flex">Back to Orders</Link>
      </div>
    )
  }

  const timeline = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
  const currentStep = timeline.indexOf(order.status)

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Account', to: '/account' }, { label: 'Orders', to: '/account/orders' }, { label: order.orderRef }]} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="heading-serif text-xl font-semibold">{order.orderRef}</h2>
          <p className="text-sm text-muted">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Status timeline */}
      {order.status !== 'cancelled' && order.status !== 'returned' && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4">Order Status</h3>
          <div className="flex items-center gap-2">
            {timeline.map((status, i) => (
              <div key={status} className="flex flex-1 items-center last:flex-none">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${i <= currentStep ? 'bg-brand text-white' : 'bg-muted-border text-muted'}`}>
                  {i + 1}
                </div>
                {i < timeline.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < currentStep ? 'bg-brand' : 'bg-muted-border'}`} />}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted">
            {timeline.map((s) => <span key={s} className="capitalize flex-1 text-center first:text-left last:text-right">{s}</span>)}
          </div>
          {order.trackingRef && (
            <p className="mt-4 text-sm"><span className="text-muted">Tracking Ref:</span> <span className="font-mono font-medium">{order.trackingRef}</span> <span className="text-xs text-muted italic ml-1">[Sample tracking — connect a shipping service for live tracking.]</span></p>
          )}
        </div>
      )}

      {/* Items */}
      <div className="card p-6">
        <h3 className="heading-serif text-lg font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.variantId} className="flex items-center justify-between border-b border-muted-border pb-3 last:border-0">
              <Link to={`/product/${item.slug}`} className="flex items-center gap-3">
                <img src={item.image || ''} alt="" className="h-12 w-12 rounded object-cover bg-muted-bg" />
                <div>
                  <div className="font-medium text-charcoal hover:text-brand">{item.name}</div>
                  <div className="text-xs text-muted">{item.size} · {item.color} × {item.quantity}</div>
                </div>
              </Link>
              <span className="font-medium">{formatCurrency(item.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm border-t border-muted-border pt-4">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>}
          <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatCurrency(order.tax)}</span></div>
          <div className="flex justify-between font-semibold text-base border-t border-muted-border pt-2 mt-1"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
        </div>
      </div>

      {/* Shipping & payment info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-2">Shipping Address</h3>
          <div className="text-sm text-muted">
            <p className="font-medium text-charcoal">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-2">Delivery & Payment</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted">Method:</span> {order.deliveryMethod}</p>
            <p><span className="text-muted">Payment:</span> {order.paymentMethod}</p>
            <div className="flex items-center gap-2"><span className="text-muted">Fulfillment:</span> <FulfillmentStatusBadge status={order.fulfillmentStatus} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
