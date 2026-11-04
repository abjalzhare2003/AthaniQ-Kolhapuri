import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, FileText, Building2 } from 'lucide-react'
import { routes } from '@/config/routes'
import { cn } from '@/utils/cn'
import { ToastContainer } from '@/components/ui/Toast'

const navItems = [
  { label: 'Dashboard', to: routes.wholesaleDashboard, icon: LayoutDashboard, end: true },
  { label: 'Catalogue', to: routes.wholesaleCatalog, icon: ShoppingBag },
  { label: 'My Orders', to: routes.wholesaleOrders, icon: Package },
  { label: 'Quote Requests', to: routes.wholesaleQuotes, icon: FileText },
  { label: 'Business Profile', to: routes.wholesaleProfile, icon: Building2 },
]

export function WholesaleLayout() {
  return (
    <div className="container-content py-6">
      <div className="mb-6">
        <h1 className="heading-serif text-2xl font-bold">Wholesale Portal</h1>
        <p className="text-sm text-muted">Bulk buying dashboard for approved partners</p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 no-scrollbar" aria-label="Wholesale navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                    isActive ? 'bg-brand-50 text-brand-500' : 'text-charcoal-50 hover:bg-muted-bg hover:text-charcoal',
                  )
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
