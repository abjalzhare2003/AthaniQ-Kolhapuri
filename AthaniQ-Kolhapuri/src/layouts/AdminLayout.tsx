import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  ShoppingCart,
  Store,
  Users,
  CreditCard,
  RotateCcw,
  Ticket,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  Building2,
  DollarSign,
  ChevronLeft,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Star,
  Bell,
  Search,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'
import { routes } from '@/config/routes'
import { useAuthStore } from '@/stores/authStore'
import { getOrders, getWholesaleApplications, getReviews, getProducts } from '@/services/dataStore'
import { cn } from '@/utils/cn'
import { ToastContainer } from '@/components/ui/Toast'

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  end?: boolean
  badge?: number | string
  badgeColor?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [headerSearch, setHeaderSearch] = useState('')

  // Derive counts from data store for real live badges
  const orders = getOrders()
  const applications = getWholesaleApplications()
  const reviews = getReviews()
  const products = getProducts()

  const countNewOrders = orders.filter((o) => o.status === 'pending').length
  const countOngoingOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'processing').length
  const countDispatchedOrders = orders.filter((o) => o.status === 'shipped').length
  const countPendingApps = applications.filter((a) => a.status === 'pending').length
  const countPendingReviews = reviews.filter((r) => r.status === 'pending').length
  const lowStockCount = products.reduce(
    (acc, p) => acc + p.variants.filter((v) => v.stock <= 5).length,
    0,
  )

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [{ label: 'Dashboard', to: routes.admin, icon: LayoutDashboard, end: true }],
    },
    {
      title: 'CATALOGUE',
      items: [
        { label: 'Products', to: routes.adminProducts, icon: Package },
        { label: 'Categories', to: routes.adminCategories, icon: Tags },
        {
          label: 'Inventory',
          to: routes.adminInventory,
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
          badgeColor: 'bg-amber-100 text-amber-800',
        },
      ],
    },
    {
      title: 'ORDERS & FULFILMENT',
      items: [
        { label: 'All Orders', to: routes.adminOrders, icon: ShoppingCart },
        {
          label: 'New Orders',
          to: routes.adminOrdersNew,
          icon: Clock,
          badge: countNewOrders > 0 ? countNewOrders : undefined,
          badgeColor: 'bg-amber-500 text-white',
        },
        {
          label: 'Ongoing (Processing)',
          to: routes.adminOrdersOngoing,
          icon: Package,
          badge: countOngoingOrders > 0 ? countOngoingOrders : undefined,
          badgeColor: 'bg-blue-100 text-blue-800',
        },
        {
          label: 'Dispatched (In Transit)',
          to: routes.adminOrdersDispatched,
          icon: Truck,
          badge: countDispatchedOrders > 0 ? countDispatchedOrders : undefined,
          badgeColor: 'bg-purple-100 text-purple-800',
        },
        { label: 'Delivered', to: routes.adminOrdersDelivered, icon: CheckCircle2 },
        { label: 'Cancelled', to: routes.adminOrdersCancelled, icon: XCircle },
      ],
    },
    {
      title: 'REVIEWS & COMMUNITY',
      items: [
        {
          label: 'Customer Reviews',
          to: routes.adminReviews,
          icon: Star,
          badge: countPendingReviews > 0 ? `${countPendingReviews} new` : undefined,
          badgeColor: 'bg-accent-100 text-accent-700 font-bold',
        },
      ],
    },
    {
      title: 'WHOLESALE B2B',
      items: [
        {
          label: 'Applications',
          to: routes.adminWholesaleApplications,
          icon: Building2,
          badge: countPendingApps > 0 ? countPendingApps : undefined,
          badgeColor: 'bg-amber-500 text-white',
        },
        { label: 'Wholesale Orders', to: routes.adminWholesaleOrders, icon: Store },
        { label: 'Wholesale Pricing', to: routes.adminWholesalePricing, icon: DollarSign },
      ],
    },
    {
      title: 'FINANCE & CUSTOMERS',
      items: [
        { label: 'Customers', to: routes.adminCustomers, icon: Users },
        { label: 'Payments', to: routes.adminPayments, icon: CreditCard },
        { label: 'Returns', to: routes.adminReturns, icon: RotateCcw },
        { label: 'Coupons', to: routes.adminCoupons, icon: Ticket },
      ],
    },
    {
      title: 'SETTINGS & CONTENT',
      items: [
        { label: 'Website Content', to: routes.adminContent, icon: FileText },
        { label: 'Reports & Analytics', to: routes.adminReports, icon: BarChart3 },
        { label: 'Settings', to: routes.adminSettings, icon: Settings },
      ],
    },
  ]

  useEffect(() => {
    setSidebarOpen(false)
    setShowNotifications(false)
    setShowUserMenu(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (headerSearch.trim()) {
      navigate(`/admin/products?search=${encodeURIComponent(headerSearch.trim())}`)
    }
  }

  return (
    <div className="flex min-h-screen bg-muted-bg text-charcoal">
      {/* ─── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-muted-border bg-white transition-all duration-300 z-30 sticky top-0 h-screen',
          collapsed ? 'w-20' : 'w-72',
        )}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between border-b border-muted-border h-16 px-4 bg-white flex-shrink-0">
          {!collapsed && (
            <Link to={routes.admin} className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-brand text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
                A
              </span>
              <div>
                <span className="font-serif text-base font-bold text-charcoal tracking-tight">
                  Athani<span className="text-brand">Q</span>
                </span>
                <span className="block text-3xs font-semibold uppercase tracking-widest text-muted">
                  GrowForge Admin
                </span>
              </div>
            </Link>
          )}

          {collapsed && (
            <Link to={routes.admin} className="mx-auto">
              <span className="h-9 w-9 rounded-lg bg-brand text-white flex items-center justify-center font-serif font-bold text-lg">
                A
              </span>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-muted hover:bg-muted-bg hover:text-charcoal transition-colors ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title}>
              {!collapsed && (
                <div className="px-3 mb-2 text-3xs font-bold uppercase tracking-wider text-muted">
                  {sec.title}
                </div>
              )}
              <div className="space-y-0.5">
                {sec.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative',
                        collapsed && 'justify-center px-0 py-2.5',
                        isActive
                          ? 'bg-brand text-white shadow-xs font-semibold'
                          : 'text-charcoal-100 hover:bg-ivory-100 hover:text-brand',
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        'h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-105',
                        collapsed && 'h-5 w-5',
                      )}
                    />
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={cn(
                          'text-3xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap',
                          item.badgeColor || 'bg-ivory-200 text-charcoal',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar user footer */}
        {!collapsed && (
          <div className="border-t border-muted-border p-3.5 bg-ivory-50 flex-shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs border border-brand-200 flex-shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-charcoal truncate">{user?.email}</div>
                <div className="text-3xs text-muted">Super Administrator</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-muted hover:text-brand hover:bg-white rounded-md transition"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>

      {/* ─── MOBILE SIDEBAR DRAWER ──────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-drawer lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-elevated flex flex-col animate-slide-in-right overflow-hidden">
            <div className="flex items-center justify-between border-b border-muted-border h-16 px-4">
              <Link to={routes.admin} className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-brand text-white flex items-center justify-center font-serif font-bold text-lg">
                  A
                </span>
                <span className="font-serif text-base font-bold text-charcoal">
                  Athani<span className="text-brand">Q</span> Admin
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-charcoal hover:bg-muted-bg rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
              {navSections.map((sec) => (
                <div key={sec.title}>
                  <div className="px-3 mb-1.5 text-3xs font-bold uppercase tracking-wider text-muted">
                    {sec.title}
                  </div>
                  <div className="space-y-0.5">
                    {sec.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                            isActive
                              ? 'bg-brand text-white font-semibold'
                              : 'text-charcoal hover:bg-ivory-100',
                          )
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge !== undefined && (
                          <span
                            className={cn(
                              'text-3xs font-bold px-2 py-0.5 rounded-full',
                              item.badgeColor || 'bg-ivory-200 text-charcoal',
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-muted-border p-4 bg-ivory-50 flex items-center justify-between">
              <span className="text-xs text-muted truncate">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ─── MAIN CONTENT VIEWPORT ──────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-sticky bg-white border-b border-muted-border h-16 px-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-charcoal hover:bg-muted-bg rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to={routes.admin} className="font-serif text-lg font-bold text-charcoal">
            Athani<span className="text-brand">Q</span> Admin
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-charcoal hover:bg-muted-bg rounded-lg"
            title="Open Storefront"
          >
            <ExternalLink className="h-5 w-5 text-brand" />
          </a>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex sticky top-0 z-sticky bg-white border-b border-muted-border h-16 px-8 items-center justify-between shadow-xs">
          {/* Quick Search */}
          <form onSubmit={handleHeaderSearch} className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="search"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Quick search products, orders, customers…"
              className="input-base pl-9 py-1.5 text-xs bg-ivory-50/70 border-muted-border focus:bg-white"
            />
          </form>

          {/* Right Header Navigation & User Profile */}
          <div className="flex items-center gap-4">
            {/* Storefront Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition"
            >
              <Store className="h-3.5 w-3.5" /> View Buyer Storefront <ExternalLink className="h-3 w-3" />
            </a>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-muted hover:text-charcoal hover:bg-muted-bg transition"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {countNewOrders + countPendingApps + countPendingReviews > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-white" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-muted-border shadow-elevated p-4 space-y-3 z-50">
                  <div className="flex items-center justify-between border-b border-muted-border pb-2">
                    <span className="font-semibold text-xs text-charcoal uppercase tracking-wider">
                      Pending Action Alerts
                    </span>
                    <span className="text-3xs text-muted">Live sync</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {countNewOrders > 0 && (
                      <Link
                        to={routes.adminOrdersNew}
                        className="flex items-center justify-between p-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition text-amber-900"
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-600" /> {countNewOrders} New Orders waiting
                        </span>
                        <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
                      </Link>
                    )}

                    {countPendingApps > 0 && (
                      <Link
                        to={routes.adminWholesaleApplications}
                        className="flex items-center justify-between p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition text-blue-900"
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600" /> {countPendingApps} Wholesale Applications
                        </span>
                        <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
                      </Link>
                    )}

                    {countPendingReviews > 0 && (
                      <Link
                        to={routes.adminReviews}
                        className="flex items-center justify-between p-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition text-purple-900"
                      >
                        <span className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-purple-600" /> {countPendingReviews} Customer Reviews to moderate
                        </span>
                        <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
                      </Link>
                    )}

                    {countNewOrders === 0 && countPendingApps === 0 && countPendingReviews === 0 && (
                      <div className="text-center py-4 text-muted">All operational queues are clear!</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-muted-bg transition"
              >
                <div className="h-8 w-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  A
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-charcoal leading-tight">Admin User</div>
                  <div className="text-3xs text-muted leading-tight">AthaniQ Kolhapur</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-muted-border shadow-elevated p-2 space-y-1 z-50 text-xs">
                  <div className="p-2 border-b border-muted-border">
                    <p className="font-semibold text-charcoal">{user?.email}</p>
                    <p className="text-3xs text-muted">Role: Operations Admin</p>
                  </div>
                  <Link
                    to={routes.adminSettings}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted-bg text-charcoal"
                  >
                    <Settings className="h-4 w-4" /> System Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
