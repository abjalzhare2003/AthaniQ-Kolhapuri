import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  Package,
  Building2,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Star,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { getDashboardMetrics, getSalesTrend } from '@/services/analyticsService'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { formatCurrency, formatNumber, formatDate } from '@/utils/format'
import { routes } from '@/config/routes'

export function AdminDashboard() {
  const [trendPeriod, setTrendPeriod] = useState<number>(6)
  const metrics = getDashboardMetrics()
  const salesTrend = getSalesTrend(trendPeriod)

  return (
    <div className="space-y-6">
      {/* Demo Mode Notice */}
      <div className="rounded-xl bg-ivory-200/80 border border-brand-200/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-charcoal">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>
            <strong>ATHANIQ KOLHAPUR OPERATIONS PANEL</strong> — Demonstration data mode active. All order
            calculations, variant pricing, review moderation, and inventory updates are live and stored in browser
            local persistence.
          </span>
        </div>
        <div className="text-muted flex-shrink-0">GrowForge Engineering</div>
      </div>

      <AdminPageHeader
        title="Operations Dashboard"
        description="Real-time overview of AthaniQ Kolhapuri retail, wholesale orders, artisan catalogue, and fulfilment"
      />

      {/* Primary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales */}
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Sales</span>
            <div className="h-9 w-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-charcoal">{formatCurrency(metrics.totalSales)}</div>
          <div className="text-xs text-muted flex items-center justify-between pt-1">
            <span>Retail: {formatCurrency(metrics.retailSales)}</span>
            <span>B2B: {formatCurrency(metrics.wholesaleSales)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">All Orders</span>
            <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-charcoal">{formatNumber(metrics.orderCount)}</div>
          <div className="text-xs text-muted flex items-center justify-between pt-1">
            <span>Retail: {metrics.retailOrderCount}</span>
            <span>Wholesale: {metrics.wholesaleOrderCount}</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Avg Order Value</span>
            <div className="h-9 w-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-charcoal">{formatCurrency(metrics.averageOrderValue)}</div>
          <div className="text-xs text-muted pt-1">Across all confirmed customer orders</div>
        </div>

        {/* Wholesale & Pending Reviews */}
        <div className="card p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Tasks</span>
            <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">
            {metrics.pendingApplications + metrics.pendingReviewsCount}
          </div>
          <div className="text-xs text-muted flex items-center justify-between pt-1">
            <Link to={routes.adminWholesaleApplications} className="hover:text-brand underline">
              {metrics.pendingApplications} Wholesale Apps
            </Link>
            <Link to={routes.adminReviews} className="hover:text-brand underline">
              {metrics.pendingReviewsCount} Reviews
            </Link>
          </div>
        </div>
      </div>

      {/* Fulfilment Pipeline Status Cards (CRITICAL REQUIREMENT #12 SEPARATE VIEWS) */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-serif text-lg font-semibold text-charcoal">
            Fulfilment Pipeline & Order Status Views
          </h2>
          <span className="text-xs text-muted">Click any pipeline stage to view dedicated order page</span>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {/* New Orders */}
          <Link
            to={routes.adminOrdersNew}
            className="group rounded-xl border border-muted-border bg-ivory-50 p-4 hover:border-brand hover:bg-white transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-semibold text-amber-800">1. New Orders</span>
              <Clock className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-700">{metrics.newOrderCount}</div>
            <div className="text-3xs text-muted mt-1 flex items-center gap-1 group-hover:text-brand">
              Awaiting confirmation <ArrowUpRight className="h-3 w-3" />
            </div>
          </Link>

          {/* Ongoing Orders */}
          <Link
            to={routes.adminOrdersOngoing}
            className="group rounded-xl border border-muted-border bg-ivory-50 p-4 hover:border-brand hover:bg-white transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-semibold text-blue-800">2. Ongoing (Processing)</span>
              <Package className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-700">{metrics.ongoingOrderCount}</div>
            <div className="text-3xs text-muted mt-1 flex items-center gap-1 group-hover:text-brand">
              Packing & Preparation <ArrowUpRight className="h-3 w-3" />
            </div>
          </Link>

          {/* Dispatched Orders */}
          <Link
            to={routes.adminOrdersDispatched}
            className="group rounded-xl border border-muted-border bg-ivory-50 p-4 hover:border-brand hover:bg-white transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-semibold text-purple-800">3. Dispatched</span>
              <Truck className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-700">{metrics.dispatchedOrderCount}</div>
            <div className="text-3xs text-muted mt-1 flex items-center gap-1 group-hover:text-brand">
              In transit with courier <ArrowUpRight className="h-3 w-3" />
            </div>
          </Link>

          {/* Delivered Orders */}
          <Link
            to={routes.adminOrdersDelivered}
            className="group rounded-xl border border-muted-border bg-ivory-50 p-4 hover:border-brand hover:bg-white transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-semibold text-green-800">4. Delivered</span>
              <CheckCircle2 className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-green-700">{metrics.deliveredOrderCount}</div>
            <div className="text-3xs text-muted mt-1 flex items-center gap-1 group-hover:text-brand">
              Fulfilled successfully <ArrowUpRight className="h-3 w-3" />
            </div>
          </Link>

          {/* Cancelled Orders */}
          <Link
            to={routes.adminOrdersCancelled}
            className="group rounded-xl border border-muted-border bg-ivory-50 p-4 hover:border-brand hover:bg-white transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-muted text-xs">
              <span className="font-semibold text-red-800">5. Cancelled</span>
              <XCircle className="h-4 w-4 text-red-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-red-700">{metrics.cancelledOrderCount}</div>
            <div className="text-3xs text-muted mt-1 flex items-center gap-1 group-hover:text-brand">
              Cancelled / Restocked <ArrowUpRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="heading-serif text-lg font-semibold text-charcoal">
              Revenue & Sales Trends
            </h2>
            <p className="text-xs text-muted">
              Monthly revenue breakdown by Retail and Wholesale B2B channels
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[3, 6, 12].map((m) => (
              <button
                key={m}
                onClick={() => setTrendPeriod(m)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                  trendPeriod === m
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-muted border-muted-border hover:border-brand'
                }`}
              >
                {m} Months
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted-border/60" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: '10px',
                  backgroundColor: '#FFFDF9',
                  border: '1px solid #E8DCCB',
                  boxShadow: '0 4px 16px rgba(43,26,16,0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="retail" fill="#5C2A12" name="Retail Orders" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wholesale" fill="#E39A3B" name="Wholesale B2B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Stock Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-muted-border pb-3">
            <h3 className="heading-serif text-base font-semibold text-charcoal">Recent Customer Orders</h3>
            <Link to={routes.adminOrders} className="text-xs text-brand hover:underline font-medium">
              View All ({metrics.orderCount}) →
            </Link>
          </div>

          <div className="space-y-2.5">
            {metrics.recentOrders.map((o) => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="flex items-center justify-between rounded-xl border border-muted-border p-3 hover:bg-ivory-100 hover:border-brand-300 transition-all"
              >
                <div className="min-w-0">
                  <div className="font-mono font-bold text-sm text-brand">{o.orderRef}</div>
                  <div className="text-xs text-muted truncate">
                    {o.customerName} · {formatDate(o.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <OrderStatusBadge status={o.status} />
                  <span className="text-sm font-bold text-charcoal">{formatCurrency(o.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts & Inventory Health */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-muted-border pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="heading-serif text-base font-semibold text-charcoal">Low Stock Alerts</h3>
            </div>
            <Link to={routes.adminInventory} className="text-xs text-brand hover:underline font-medium">
              Manage Inventory →
            </Link>
          </div>

          <div className="space-y-2.5">
            {metrics.lowStockProducts.slice(0, 5).map((item) => (
              <div
                key={item.variantId}
                className="flex items-center justify-between rounded-xl bg-amber-50/70 border border-amber-200/60 p-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-charcoal truncate">{item.name}</div>
                  <div className="text-xs text-muted">
                    Size: <strong>{item.size}</strong> · Color: <strong>{item.color}</strong> · SKU:{' '}
                    <span className="font-mono">{item.sku}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {item.stock} left
                </span>
              </div>
            ))}

            {metrics.lowStockProducts.length === 0 && (
              <div className="p-6 text-center text-xs text-muted">
                All footwear product variants have healthy stock levels (&gt; 5 pairs).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Customer Reviews & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Customer Reviews */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-muted-border pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent fill-accent" />
              <h3 className="heading-serif text-base font-semibold text-charcoal">
                Recent Customer Reviews
              </h3>
            </div>
            <Link to={routes.adminReviews} className="text-xs text-brand hover:underline font-medium">
              Moderate Reviews ({metrics.pendingReviewsCount} pending) →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.recentReviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-muted-border p-3 bg-white space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-charcoal">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-3xs text-green-700 font-bold inline-flex items-center gap-0.5">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-3xs font-bold uppercase px-2 py-0.5 rounded-full ${
                      rev.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : rev.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-accent">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${s <= rev.rating ? 'fill-accent' : 'text-muted-border'}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-charcoal ml-1">{rev.productName}</span>
                </div>
                <p className="text-xs text-charcoal-100 line-clamp-2">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operational Shortcuts */}
        <div className="card p-6 space-y-4">
          <h3 className="heading-serif text-base font-semibold text-charcoal border-b border-muted-border pb-3">
            Management Modules
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={routes.adminProductNew}
              className="rounded-xl border border-muted-border p-3.5 text-center text-xs hover:bg-ivory-100 hover:border-brand-300 transition-colors"
            >
              <Package className="h-6 w-6 mx-auto mb-1.5 text-brand" />
              <div className="font-semibold text-charcoal">Add New Product</div>
              <span className="text-3xs text-muted">Variants & sizing</span>
            </Link>

            <Link
              to={routes.adminWholesaleApplications}
              className="rounded-xl border border-muted-border p-3.5 text-center text-xs hover:bg-ivory-100 hover:border-brand-300 transition-colors"
            >
              <Building2 className="h-6 w-6 mx-auto mb-1.5 text-brand" />
              <div className="font-semibold text-charcoal">Wholesale B2B</div>
              <span className="text-3xs text-muted">
                {metrics.pendingApplications} pending approvals
              </span>
            </Link>

            <Link
              to={routes.adminOrdersDispatched}
              className="rounded-xl border border-muted-border p-3.5 text-center text-xs hover:bg-ivory-100 hover:border-brand-300 transition-colors"
            >
              <Truck className="h-6 w-6 mx-auto mb-1.5 text-brand" />
              <div className="font-semibold text-charcoal">Shipment Tracking</div>
              <span className="text-3xs text-muted">Couriers & AWBs</span>
            </Link>

            <Link
              to={routes.adminReturns}
              className="rounded-xl border border-muted-border p-3.5 text-center text-xs hover:bg-ivory-100 hover:border-brand-300 transition-colors"
            >
              <RotateCcw className="h-6 w-6 mx-auto mb-1.5 text-brand" />
              <div className="font-semibold text-charcoal">Returns & Refunds</div>
              <span className="text-3xs text-muted">
                {metrics.pendingReturns} requests pending
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
