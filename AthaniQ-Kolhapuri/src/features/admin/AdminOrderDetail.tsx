import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Truck,
  CheckCircle2,
  Printer,
  User,
  MapPin,
  History,
  AlertCircle,
} from 'lucide-react'
import { getOrderById, updateOrderStatus, updateOrder } from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Select, Button, Input, Textarea } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import { routes } from '@/config/routes'
import type { OrderStatus, PaymentStatus, FulfillmentStatus } from '@/types'

export function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const order = id ? getOrderById(id) : undefined

  const [status, setStatus] = useState<OrderStatus>(order?.status ?? 'pending')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order?.paymentStatus ?? 'pending')
  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus>(order?.fulfillmentStatus ?? 'unfulfilled')

  // Dispatch modal
  const [showDispatchDialog, setShowDispatchDialog] = useState(false)
  const [courierName, setCourierName] = useState(order?.courierName ?? 'Blue Dart Express')
  const [trackingRef, setTrackingRef] = useState(order?.trackingRef ?? `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`)
  const [dispatchNote, setDispatchNote] = useState('')
  const [statusChangeNote, setStatusChangeNote] = useState('')

  const [, forceRender] = useState(0)

  if (!order) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 mx-auto text-muted" />
        <h2 className="text-xl font-serif font-bold text-charcoal">Order Not Found</h2>
        <p className="text-sm text-muted">The requested order reference could not be located.</p>
        <Link to={routes.adminOrders} className="btn btn-primary inline-flex">
          Back to Orders
        </Link>
      </div>
    )
  }

  const handleUpdateStatus = () => {
    updateOrderStatus(order.id, status, {
      note: statusChangeNote.trim() || undefined,
      actor: 'Admin Operations',
    })
    updateOrder(order.id, {
      paymentStatus,
      fulfillmentStatus,
    })
    toast('success', `Order ${order.orderRef} status updated to ${status}`)
    setStatusChangeNote('')
    forceRender((n) => n + 1)
  }

  const handleConfirmDispatch = () => {
    if (!trackingRef.trim()) {
      toast('error', 'Tracking number is required.')
      return
    }

    updateOrderStatus(order.id, 'shipped', {
      courierName: courierName.trim(),
      trackingRef: trackingRef.trim(),
      dispatchDate: new Date().toISOString(),
      note: dispatchNote.trim() || `Dispatched via ${courierName} tracking #${trackingRef}`,
      actor: 'Admin Fulfilment Team',
    })

    setStatus('shipped')
    setFulfillmentStatus('shipped')
    setShowDispatchDialog(false)
    toast('success', `Order ${order.orderRef} marked as Dispatched via ${courierName}`)
    forceRender((n) => n + 1)
  }

  const handlePrintInvoice = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Order ${order.orderRef}`}
        description={`Placed on ${formatDate(order.createdAt)} · Type: ${order.type.toUpperCase()}`}
        backTo={routes.adminOrders}
        backLabel="Back to Orders"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrintInvoice} className="flex items-center gap-1.5">
              <Printer className="h-4 w-4" /> Print Invoice
            </Button>
            {order.status !== 'shipped' && order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button size="sm" onClick={() => setShowDispatchDialog(true)} className="flex items-center gap-1.5">
                <Truck className="h-4 w-4" /> Dispatch Order
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Items & Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Products (Purchase-Time Snapshots) */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-muted-border pb-3">
              <h2 className="heading-serif text-lg font-semibold text-charcoal">
                Order Items ({order.items.length})
              </h2>
              <span className="text-3xs text-muted italic">
                * Prices preserved at time of purchase snapshot
              </span>
            </div>

            <div className="divide-y divide-muted-border">
              {order.items.map((item, index) => (
                <div key={index} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image || ''}
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover bg-ivory-100 border border-muted-border flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-charcoal truncate">{item.name}</div>
                      <div className="text-xs text-muted mt-0.5">
                        Size: <strong className="text-charcoal">{item.size}</strong> · Color:{' '}
                        <strong className="text-charcoal">{item.color}</strong>
                      </div>
                      <div className="text-xs text-muted">
                        Unit Price: {formatCurrency(item.price)} × {item.quantity} pairs
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-sm text-charcoal">{formatCurrency(item.lineTotal)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-muted-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Items Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Shipping & Handling</span>
                <span>{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Estimated GST Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-muted-border pt-3 text-charcoal">
                <span>Grand Total</span>
                <span className="text-brand text-lg">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="card p-5 space-y-3">
              <div className="flex items-center gap-2 text-brand font-semibold text-sm border-b border-muted-border pb-2">
                <MapPin className="h-4 w-4" /> Shipping Address
              </div>
              <div className="text-sm space-y-0.5 text-charcoal-100">
                <p className="font-bold text-charcoal">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-xs text-muted pt-1">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="card p-5 space-y-3">
              <div className="flex items-center gap-2 text-brand font-semibold text-sm border-b border-muted-border pb-2">
                <User className="h-4 w-4" /> Customer & Channel
              </div>
              <div className="text-sm space-y-1 text-charcoal-100">
                <p>
                  <span className="text-muted text-xs">Customer Name:</span>{' '}
                  <strong>{order.customerName}</strong>
                </p>
                <p>
                  <span className="text-muted text-xs">Email:</span> {order.customerEmail}
                </p>
                <p>
                  <span className="text-muted text-xs">Account Type:</span>{' '}
                  <span className="capitalize font-semibold">{order.type}</span>
                </p>
                <p>
                  <span className="text-muted text-xs">Payment Method:</span> {order.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Shipment Tracking details if dispatched */}
          {order.trackingRef && (
            <div className="card p-5 bg-ivory-50 border-brand-200 space-y-2">
              <div className="flex items-center gap-2 text-brand font-semibold text-sm">
                <Truck className="h-4 w-4" /> Logistics & Courier Dispatch Details
              </div>
              <div className="grid gap-2 sm:grid-cols-3 text-xs pt-1">
                <div>
                  <span className="text-muted block">Logistics Partner:</span>
                  <strong className="text-charcoal text-sm">{order.courierName || 'Blue Dart Express'}</strong>
                </div>
                <div>
                  <span className="text-muted block">Tracking Reference (AWB):</span>
                  <strong className="text-charcoal font-mono text-sm">{order.trackingRef}</strong>
                </div>
                <div>
                  <span className="text-muted block">Dispatch Date:</span>
                  <span className="text-charcoal">{order.dispatchDate ? formatDateTime(order.dispatchDate) : 'Recently Dispatched'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Status History Timeline */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-muted-border pb-3">
              <History className="h-5 w-5 text-brand" />
              <h3 className="heading-serif text-base font-semibold text-charcoal">
                Order Status History & Audit Trail
              </h3>
            </div>

            <div className="space-y-4">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                order.statusHistory.map((item, idx) => (
                  <div key={item.id || idx} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-brand" />
                      {idx !== (order.statusHistory?.length ?? 1) - 1 && (
                        <div className="w-0.5 flex-1 bg-muted-border mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={item.status} />
                        <span className="text-xs text-muted">{formatDateTime(item.timestamp)}</span>
                        {item.actor && (
                          <span className="text-3xs text-muted font-medium">by {item.actor}</span>
                        )}
                      </div>
                      {item.note && <p className="text-xs text-charcoal-100 mt-1">{item.note}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-3 text-sm">
                  <div className="h-3 w-3 rounded-full bg-brand" />
                  <div>
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <span className="text-xs text-muted">{formatDateTime(order.createdAt)}</span>
                    </div>
                    <p className="text-xs text-muted mt-1">Order placed by customer.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Update Status Form */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="heading-serif text-lg font-semibold text-charcoal">Manage Fulfilment</h2>

            <div className="space-y-3">
              <Select
                label="Order Status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              >
                <option value="pending">Pending (New Order)</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing & Packing</option>
                <option value="shipped">Shipped (Dispatched to Courier)</option>
                <option value="delivered">Delivered to Customer</option>
                <option value="cancelled">Cancelled</option>
              </Select>

              <Select
                label="Payment Status"
                name="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              >
                <option value="pending">Payment Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Payment Failed</option>
              </Select>

              <Select
                label="Fulfillment Status"
                name="fulfillmentStatus"
                value={fulfillmentStatus}
                onChange={(e) => setFulfillmentStatus(e.target.value as FulfillmentStatus)}
              >
                <option value="unfulfilled">Unfulfilled</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </Select>

              <Textarea
                label="Status Change Note (Internal)"
                name="note"
                rows={2}
                value={statusChangeNote}
                onChange={(e) => setStatusChangeNote(e.target.value)}
                placeholder="e.g. Verified payment receipt; artisan finished stitching…"
              />

              <Button onClick={handleUpdateStatus} className="w-full">
                Save Status Changes
              </Button>
            </div>
          </div>

          <div className="card p-5 space-y-3 bg-white">
            <h3 className="heading-serif text-sm font-semibold text-charcoal">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDispatchDialog(true)}
                className="w-full justify-start text-xs flex items-center gap-2"
              >
                <Truck className="h-4 w-4 text-brand" /> Update Dispatch Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateOrderStatus(order.id, 'delivered', {
                    actor: 'Admin',
                    note: 'Customer delivery confirmed via courier signature.',
                  })
                  setStatus('delivered')
                  setFulfillmentStatus('delivered')
                  toast('success', 'Order marked as Delivered')
                  forceRender((n) => n + 1)
                }}
                className="w-full justify-start text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Mark as Delivered
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      <Dialog
        open={showDispatchDialog}
        onClose={() => setShowDispatchDialog(false)}
        title={`Logistics Handover — ${order.orderRef}`}
        size="md"
      >
        <div className="space-y-4">
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
            value={trackingRef}
            onChange={(e) => setTrackingRef(e.target.value)}
            placeholder="e.g. BD987654321IN"
          />

          <Input
            label="Shipment Notes (optional)"
            name="notes"
            value={dispatchNote}
            onChange={(e) => setDispatchNote(e.target.value)}
            placeholder="e.g. Double boxed with moisture barrier"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setShowDispatchDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDispatch}>Save & Mark Dispatched</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
