import { Link } from 'react-router-dom'
import type { Order } from '@/types'
import { getProductById } from '@/data/products'
import { formatCurrency, formatDate } from '@/utils/format'
import { OrderStatusBadge } from '@/components/ui/Badge'

/** One order in the "My Orders" list: thumbnail, reference, date, status, total. */
export function OrderRow({ order }: { order: Order }) {
  const first = order.items[0]
  const image = first?.image || (first ? getProductById(first.productId)?.images[0] : undefined)
  const extra = order.items.length - 1

  return (
    <Link
      to={`/account/orders/${order.id}`}
      className="flex items-center gap-4 rounded-xl border border-muted-border bg-ivory-50 p-3.5 transition-shadow hover:shadow-card"
    >
      <span className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-ivory-200">
        {image && <img src={image} alt="" className="h-full w-full object-cover" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-brand-700">#{order.orderRef}</span>
        <span className="block truncate text-xs text-muted">
          Placed on {formatDate(order.createdAt)}{extra > 0 ? ` · ${first?.name} +${extra} more` : first ? ` · ${first.name}` : ''}
        </span>
      </span>
      <span className="flex flex-col items-end gap-1.5">
        <OrderStatusBadge status={order.status} />
        <span className="text-sm font-bold text-brand-700">{formatCurrency(order.total)}</span>
      </span>
    </Link>
  )
}
