import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { getOrders, updateOrderStatus } from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { Button, Input, Select } from '@/components/ui/Input'
import { formatCurrency, formatDate } from '@/utils/format'
import { routes } from '@/config/routes'
import { toast } from '@/stores/toastStore'
import type { Order } from '@/types'

export type OrderViewMode = 'all' | 'new' | 'ongoing' | 'dispatched' | 'delivered' | 'cancelled'

interface AdminOrdersProps {
  mode?: OrderViewMode
}

export function AdminOrders({ mode = 'all' }: AdminOrdersProps) {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'retail' | 'wholesale'>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null)
  const [courierName, setCourierName] = useState('Blue Dart Express')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [dispatchNotes, setDispatchNotes] = useState('')
  const [, forceRender] = useState(0)

  // Determine current mode from prop or location path
  let currentMode: OrderViewMode = mode
  if (location.pathname.includes('/orders/new')) currentMode = 'new'
  else if (location.pathname.includes('/orders/ongoing')) currentMode = 'ongoing'
  else if (location.pathname.includes('/orders/dispatched')) currentMode = 'dispatched'
  else if (location.pathname.includes('/orders/delivered')) currentMode = 'delivered'
  else if (location.pathname.includes('/orders/cancelled')) currentMode = 'cancelled'

  const allOrders = getOrders()

  // Filter based on view mode
  const filteredOrders = allOrders.filter((o) => {
    // Mode status constraint
    if (currentMode === 'new' && o.status !== 'pending') return false
    if (currentMode === 'ongoing' && o.status !== 'confirmed' && o.status !== 'processing') return false
    if (currentMode === 'dispatched' && o.status !== 'shipped') return false
    if (currentMode === 'delivered' && o.status !== 'delivered') return false
    if (currentMode === 'cancelled' && o.status !== 'cancelled') return false

    // Order Type (Retail vs Wholesale)
    if (typeFilter !== 'all' && o.type !== typeFilter) return false

    // Payment Filter
    if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchRef = o.orderRef.toLowerCase().includes(q)
      const matchCust = o.customerName.toLowerCase().includes(q)
      const matchEmail = o.customerEmail.toLowerCase().includes(q)
      const matchTracking = o.trackingRef?.toLowerCase().includes(q)
      if (!matchRef && !matchCust && !matchEmail && !matchTracking) return false
    }

    return true
  })

  // Counters for tabs
  const countAll = allOrders.length
  const countNew = allOrders.filter((o) => o.status === 'pending').length
  const countOngoing = allOrders.filter((o) => o.status === 'confirmed' || o.status === 'processing').length
  const countDispatched = allOrders.filter((o) => o.status === 'shipped').length
  const countDelivered = allOrders.filter((o) => o.status === 'delivered').length
  const countCancelled = allOrders.filter((o) => o.status === 'cancelled').length

  const getPageTitle = () => {
    switch (currentMode) {
      case 'new':
        return 'New Orders'
      case 'ongoing':
        return 'Ongoing Orders (Processing)'
      case 'dispatched':
        return 'Dispatched Orders (In Transit)'
      case 'delivered':
        return 'Delivered Orders'
      case 'cancelled':
        return 'Cancelled Orders'
      default:
        return 'All Orders'
    }
  }

  const getPageDescription = () => {
    switch (currentMode) {
      case 'new':
        return 'Recently received retail and wholesale orders awaiting confirmation or processing'
      case 'ongoing':
        return 'Orders currently confirmed, packed, or being prepared for handover to courier'
      case 'dispatched':
        return 'Orders handed to delivery logistics with tracking numbers and live transit updates'
      case 'delivered':
        return 'Fulfilled orders successfully delivered to customers'
      case 'cancelled':
        return 'Orders cancelled by customer or admin with inventory restored'
      default:
        return 'Master list of customer retail orders and wholesale bulk orders'
    }
  }

  const handleOpenDispatch = (order: Order) => {
    setDispatchModalOrder(order)
    setTrackingNumber(order.trackingRef || `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`)
    setCourierName(order.courierName || 'Blue Dart Express')
    setDispatchNotes('')
  }

  const handleConfirmDispatch = () => {
    if (!dispatchModalOrder) return
    if (!trackingNumber.trim()) {
      toast('error', 'Tracking / AWB reference is required.')
      return
    }

    updateOrderStatus(dispatchModalOrder.id, 'shipped', {
      actor: 'Admin Fulfilment Team',
      courierName: courierName.trim(),
      trackingRef: trackingNumber.trim(),
      dispatchDate: new Date().toISOString(),
      note: dispatchNotes.trim() || `Dispatched via ${courierName} with tracking #${trackingNumber.trim()}`,
    })

    toast('success', `Order ${dispatchModalOrder.orderRef} marked as Dispatched via ${courierName}`)
    setDispatchModalOrder(null)
    forceRender((n) => n + 1)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={getPageTitle()} description={getPageDescription()} />

      {/* Dedicated Order Status Navigation Tabs */}
      <div className="flex border-b border-muted-border bg-white rounded-t-xl px-4 pt-2 gap-1 overflow-x-auto">
        <Link
          to={routes.adminOrders}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            currentMode === 'all'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          <ShoppingCart className="h-4 w-4" /> All Orders ({countAll})
        </Link>
        <Link
          to={routes.adminOrdersNew}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            currentMode === 'new'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          <Clock className="h-4 w-4 text-amber-600" /> New Orders
          {countNew > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-white text-3xs font-bold inline-flex items-center justify-center">
              {countNew}
            </span>
          )}
        </Link>
        <Link
          to={routes.adminOrdersOngoing}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            currentMode === 'ongoing'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          <Package className="h-4 w-4 text-blue-600" /> Ongoing Orders ({countOngoing})
        </Link>
        <Link
          to={routes.adminOrdersDispatched}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            currentMode === 'dispatched'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          <Truck className="h-4 w-4 text-purple-600" /> Dispatched ({countDispatched})
        </Link>
        <Link
          to={routes.adminOrdersDelivered}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            currentMode === 'delivered'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 text-green-600" /> Delivered ({countDelivered})
        </Link>
        <Link
          to={routes.adminOrdersCancelled}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            currentMode === 'cancelled'
              ? 'border-brand text-brand font-bold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          <XCircle className="h-4 w-4 text-red-600" /> Cancelled ({countCancelled})
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="card p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ref, customer name, email, tracking #…"
              className="input-base pl-9 text-sm"
            />
          </div>

          <Select
            name="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="all">All Order Types (Retail & Wholesale)</option>
            <option value="retail">Retail Orders Only</option>
            <option value="wholesale">Wholesale Orders Only</option>
          </Select>

          <Select
            name="paymentFilter"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Payment Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </Select>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-muted-border text-xs text-muted">
          <span>
            Showing <strong>{filteredOrders.length}</strong> matching orders
          </span>
          {(search || typeFilter !== 'all' || paymentFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setTypeFilter('all')
                setPaymentFilter('all')
              }}
              className="text-brand hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted-bg border-b border-muted-border text-xs font-semibold text-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Order Ref</th>
                <th className="px-4 py-3.5">Customer & Channel</th>
                <th className="px-4 py-3.5">Placed Date</th>
                <th className="px-4 py-3.5">Items</th>
                <th className="px-4 py-3.5">Order Total</th>
                <th className="px-4 py-3.5">Fulfilment Status</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-muted-bg/40 transition-colors">
                  {/* Order Ref */}
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="font-mono font-bold text-brand hover:text-brand-700 hover:underline block"
                    >
                      {o.orderRef}
                    </Link>
                    {o.trackingRef && (
                      <span className="text-3xs text-muted block mt-0.5 truncate max-w-[120px]">
                        AWB: {o.trackingRef}
                      </span>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-charcoal">{o.customerName}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-3xs font-bold uppercase px-1.5 py-0.2 rounded border ${
                          o.type === 'wholesale'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-ivory-200 text-charcoal border-muted-border'
                        }`}
                      >
                        {o.type}
                      </span>
                      <span className="text-3xs text-muted">{o.customerEmail}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-muted text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(o.createdAt)}
                    </div>
                  </td>

                  {/* Items Summary */}
                  <td className="px-4 py-3 text-xs">
                    <span className="font-medium text-charcoal">{o.items.length} items</span>
                    <div className="text-3xs text-muted truncate max-w-[140px]">
                      {o.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 font-semibold text-charcoal">{formatCurrency(o.total)}</td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={o.paymentStatus} />
                    <span className="text-3xs text-muted block mt-0.5">{o.paymentMethod}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {(o.status === 'confirmed' || o.status === 'processing' || o.status === 'pending') && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenDispatch(o)}
                          className="text-xs py-1 px-2.5 flex items-center gap-1"
                        >
                          <Truck className="h-3.5 w-3.5" /> Dispatch
                        </Button>
                      )}
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="btn btn-ghost text-xs py-1 px-2.5 flex items-center gap-1"
                      >
                        Details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-muted space-y-2">
              <Package className="h-10 w-10 mx-auto text-muted/50" />
              <p className="font-medium text-charcoal">No orders found in this view.</p>
              <p className="text-xs">Try selecting a different status view or resetting filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Logistics Dialog */}
      <Dialog
        open={!!dispatchModalOrder}
        onClose={() => setDispatchModalOrder(null)}
        title={`Dispatch Order — ${dispatchModalOrder?.orderRef}`}
        size="md"
      >
        {dispatchModalOrder && (
          <div className="space-y-4">
            <div className="rounded-xl bg-ivory-100 p-4 border border-muted-border text-sm space-y-1">
              <div className="font-semibold text-charcoal">{dispatchModalOrder.customerName}</div>
              <div className="text-xs text-muted">
                Deliver to: {dispatchModalOrder.shippingAddress.line1}, {dispatchModalOrder.shippingAddress.city},{' '}
                {dispatchModalOrder.shippingAddress.state} - {dispatchModalOrder.shippingAddress.pincode}
              </div>
              <div className="text-xs text-muted">
                Items: {dispatchModalOrder.items.length} pairs · Total:{' '}
                <strong>{formatCurrency(dispatchModalOrder.total)}</strong>
              </div>
            </div>

            <Select
              label="Courier Logistics Partner *"
              name="courier"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
            >
              <option>Blue Dart Express</option>
              <option>Delhivery Logistics</option>
              <option>DTDC Courier</option>
              <option>India Post Speed Post</option>
              <option>Shiprocket Express</option>
              <option>Local Kolhapur Artisan Courier</option>
            </Select>

            <Input
              label="Tracking Number / AWB Reference *"
              name="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. BD123456789IN"
              hint="Customer will receive this tracking number for real-time delivery status."
            />

            <Input
              label="Shipment Notes (optional)"
              name="notes"
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              placeholder="e.g. Fragile heritage footwear packaging; waterproof outer cover"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-muted-border">
              <Button variant="ghost" onClick={() => setDispatchModalOrder(null)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDispatch}>Confirm Handover & Dispatch</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
