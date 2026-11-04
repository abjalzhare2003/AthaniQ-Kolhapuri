import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { User, Package, MapPin, Heart, Bell, RotateCcw, LogOut, Briefcase, Settings } from 'lucide-react'
import { routes } from '@/config/routes'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils/cn'
import { ToastContainer } from '@/components/ui/Toast'

const navItems = [
  { label: 'My Account', to: routes.account, icon: User, end: true },
  { label: 'Orders', to: routes.accountOrders, icon: Package },
  { label: 'Wishlist', to: routes.accountWishlist, icon: Heart },
  { label: 'Addresses', to: routes.accountAddresses, icon: MapPin },
  { label: 'Returns', to: routes.accountReturns, icon: RotateCcw },
  { label: 'Notifications', to: routes.accountNotifications, icon: Bell },
  { label: 'Wholesale Enquiry', to: '/wholesale', icon: Briefcase },
  { label: 'Account Settings', to: routes.accountProfile, icon: Settings },
]

export function AccountLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const item = 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors'

  return (
    <div className="container-content py-6">
      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <aside>
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-muted-border bg-ivory-50 p-2 no-scrollbar lg:flex-col lg:gap-0.5" aria-label="Account navigation">
            <div className="hidden px-3 pb-3 pt-2 lg:block">
              <p className="font-serif text-lg font-semibold text-brand-700">Hello, {user?.firstName}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
            {navItems.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                end={n.end}
                className={({ isActive }) => cn(item, isActive && n.to !== '/wholesale' ? 'bg-brand-50 text-brand-600 shadow-[inset_3px_0_0_#5C2A12]' : 'text-charcoal-100 hover:bg-muted-bg hover:text-charcoal')}
              >
                <n.icon className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.7} />
                {n.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className={cn(item, 'text-charcoal-100 hover:bg-muted-bg hover:text-brand-600')}>
              <LogOut className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.7} />
              Logout
            </button>
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
