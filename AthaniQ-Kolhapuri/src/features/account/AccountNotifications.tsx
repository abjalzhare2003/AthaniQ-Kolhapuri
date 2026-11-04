import { Package, Percent, Info, Building2 } from 'lucide-react'
import { formatDateTime } from '@/utils/format'

const notifications = [
  { id: 'n1', type: 'order' as const, title: 'Order Shipped', message: 'Your order AK-R-2025-000001 has been shipped. Tracking ref: TRK-2025-0001', read: false, createdAt: '2025-11-01T10:00:00Z', link: '/account/orders/order-001' },
  { id: 'n2', type: 'promo' as const, title: 'Festive Sale', message: 'Get 10% off your next order with code WELCOME10.', read: false, createdAt: '2025-10-28T08:00:00Z' },
  { id: 'n3', type: 'system' as const, title: 'Profile Updated', message: 'Your account profile was updated successfully.', read: true, createdAt: '2025-10-25T14:00:00Z' },
  { id: 'n4', type: 'wholesale' as const, title: 'Wholesale Application Approved', message: 'Your wholesale application has been approved. Access the wholesale catalogue now.', read: true, createdAt: '2025-09-03T14:00:00Z', link: '/wholesale/catalog' },
]

const iconMap = { order: Package, promo: Percent, system: Info, wholesale: Building2 }
const colorMap = { order: 'text-brand', promo: 'text-accent-500', system: 'text-muted', wholesale: 'text-blue-600' }

export function AccountNotifications() {
  return (
    <div className="space-y-2">
      <h2 className="heading-serif text-lg font-semibold mb-2">Notifications</h2>
      {notifications.map((n) => {
        const Icon = iconMap[n.type]
        return (
          <a key={n.id} href={n.link ?? '#'} className={`card p-4 flex gap-3 hover:shadow-card transition-shadow ${!n.read ? 'border-l-4 border-l-brand' : ''}`}>
            <div className="flex-shrink-0"><Icon className={`h-5 w-5 ${colorMap[n.type]}`} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-charcoal">{n.title}</h3>
                {!n.read && <span className="h-2 w-2 rounded-full bg-brand flex-shrink-0" aria-label="Unread" />}
              </div>
              <p className="mt-1 text-sm text-muted">{n.message}</p>
              <p className="mt-1 text-xs text-muted">{formatDateTime(n.createdAt)}</p>
            </div>
          </a>
        )
      })}
    </div>
  )
}
