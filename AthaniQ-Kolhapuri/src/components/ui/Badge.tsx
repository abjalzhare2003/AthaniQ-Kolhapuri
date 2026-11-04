import { cn } from '@/utils/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent' | 'brand'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-muted-bg text-charcoal-50',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-800',
  accent: 'bg-accent-50 text-accent-600',
  brand: 'bg-brand-50 text-brand-500',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn('badge', variantClasses[variant], className)}>
      {children}
    </span>
  )
}

// Specialized badges for order/payment/fulfillment status
import type { OrderStatus, PaymentStatus, FulfillmentStatus, WholesaleApplicationStatus } from '@/types'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Pending', variant: 'warning' },
    confirmed: { label: 'Confirmed', variant: 'info' },
    processing: { label: 'Processing', variant: 'info' },
    shipped: { label: 'Shipped', variant: 'info' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'error' },
    returned: { label: 'Returned', variant: 'default' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Pending', variant: 'warning' },
    paid: { label: 'Paid', variant: 'success' },
    refunded: { label: 'Refunded', variant: 'default' },
    failed: { label: 'Failed', variant: 'error' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function FulfillmentStatusBadge({ status }: { status: FulfillmentStatus }) {
  const map: Record<FulfillmentStatus, { label: string; variant: BadgeVariant }> = {
    unfulfilled: { label: 'Unfulfilled', variant: 'default' },
    processing: { label: 'Processing', variant: 'info' },
    shipped: { label: 'Shipped', variant: 'info' },
    delivered: { label: 'Delivered', variant: 'success' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function WholesaleStatusBadge({ status }: { status: WholesaleApplicationStatus }) {
  const map: Record<WholesaleApplicationStatus, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Pending Review', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'error' },
    info_required: { label: 'Info Required', variant: 'info' },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}
