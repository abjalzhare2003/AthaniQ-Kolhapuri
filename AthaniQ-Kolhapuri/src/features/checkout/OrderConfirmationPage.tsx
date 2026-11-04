import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import { getOrderById } from '@/services/dataStore'
import { formatCurrency, formatDate } from '@/utils/format'

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const order = orderId ? getOrderById(orderId) : undefined

  if (!order) {
    return (
      <div className="container-content py-12 text-center">
        <h1 className="heading-serif text-2xl">Order not found</h1>
        <Link to="/shop" className="btn btn-primary mt-4 inline-flex">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-narrow py-12">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-4 heading-serif text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted">Thank you for your purchase. Your order has been placed successfully.</p>
        <div className="mt-4 inline-block rounded-lg bg-muted-bg px-6 py-3">
          <span className="text-sm text-muted">Order Reference: </span>
          <span className="font-mono font-semibold text-charcoal">{order.orderRef}</span>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted">
          <Package className="h-4 w-4" /> Placed on {formatDate(order.createdAt)}
        </div>
        <h2 className="heading-serif text-lg font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.variantId} className="flex items-center justify-between border-b border-muted-border pb-3 last:border-0">
              <div>
                <Link to={`/product/${item.slug}`} className="font-medium text-charcoal hover:text-brand">{item.name}</Link>
                <p className="text-sm text-muted">{item.size} · {item.color} × {item.quantity}</p>
              </div>
              <span className="font-medium">{formatCurrency(item.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-muted-border pt-4 text-sm">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatCurrency(order.tax)}</span></div>
          <div className="flex justify-between font-semibold text-base border-t border-muted-border pt-2 mt-2"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
        </div>
        <div className="mt-4 rounded-lg bg-muted-bg p-3 text-sm">
          <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
          <p><strong>Payment:</strong> {order.paymentMethod} {order.paymentStatus === 'pending' && '(Pending)'}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/account/orders" className="btn btn-primary">View My Orders <ArrowRight className="h-4 w-4" /></Link>
        <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  )
}
