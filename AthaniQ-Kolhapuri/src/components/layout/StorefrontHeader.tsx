import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X, Truck, ShieldCheck, Hammer, Gem } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { siteConfig } from '@/config/site'
import { Logo } from '@/components/ui/Logo'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/utils/cn'

const perks = [
  { icon: Truck, text: `Free Shipping Above ${formatCurrency(siteConfig.shipping.freeThreshold)}` },
  { icon: Gem, text: '100% Genuine Leather' },
  { icon: Hammer, text: 'Handcrafted by Artisans' },
  { icon: ShieldCheck, text: 'Secure Payments' },
]

export function StorefrontHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { items: cartItems } = useCartStore()
  const { user, isAdmin } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchValue.trim())}`)
      setMobileOpen(false)
      setSearchOpen(false)
    }
  }

  const iconBtn =
    'relative flex h-10 w-10 items-center justify-center rounded-full text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

  return (
    <>
      {/* Announcement bar — scrolling marquee */}
      <div className="banner-brown overflow-hidden text-ivory" role="region" aria-label="Store highlights">
        <div className="group flex w-max animate-marquee py-2 text-[11px] font-medium hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex flex-shrink-0 items-center" aria-hidden={copy === 1}>
              {[...perks, ...perks].map(({ icon: Icon, text }, i) => (
                <li key={`${text}-${i}`} className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap pr-12">
                  <Icon className="h-3.5 w-3.5 text-accent-300" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <header className={cn('sticky top-0 z-header border-b border-muted-border bg-ivory-50/95 backdrop-blur transition-shadow duration-slow', scrolled && 'shadow-soft')}>
        <div className="container-content">
          <div className="flex h-[72px] items-center justify-between gap-4">
            <button onClick={() => setMobileOpen(true)} className={cn(iconBtn, 'lg:hidden -ml-2')} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>

            <Logo />

            <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
              {siteConfig.nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative py-2 text-[13px] font-medium text-charcoal transition-colors hover:text-brand',
                      isActive && 'text-brand after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded after:bg-accent',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <form onSubmit={handleSearch} className={cn('items-center overflow-hidden transition-all duration-slow', searchOpen ? 'flex w-40 sm:w-60' : 'hidden w-0')}>
                <input
                  ref={searchRef}
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                  placeholder="Search chappals…"
                  className="w-full rounded-full border border-muted-border bg-white px-4 py-1.5 text-sm focus:border-brand focus:outline-none"
                  aria-label="Search products"
                />
              </form>
              <button onClick={() => setSearchOpen((v) => !v)} className={iconBtn} aria-label={searchOpen ? 'Close search' : 'Open search'}>
                {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
              </button>
              {isAdmin ? (
                <Link to="/admin" className="hidden sm:flex h-9 items-center rounded-full bg-accent-50 px-3 text-xs font-semibold text-accent-600 hover:bg-accent-100">Admin</Link>
              ) : (
                <Link to={user ? '/account' : '/login'} className={cn(iconBtn, 'hidden sm:flex')} aria-label={user ? 'My account' : 'Login'}>
                  <User className="h-[18px] w-[18px]" />
                </Link>
              )}
              <Link to="/cart" className={iconBtn} aria-label={`Cart, ${cartCount} items`}>
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-brand-700">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-drawer lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="absolute inset-0 bg-brand-700/60 animate-fade-in" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-ivory-50 shadow-elevated animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-muted-border px-4 py-3">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className={iconBtn} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="border-b border-muted-border p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search products…"
                  className="w-full rounded-full border border-muted-border bg-white py-2 pl-9 pr-3 text-sm focus:border-brand focus:outline-none"
                  aria-label="Search products"
                />
              </div>
            </form>
            <nav className="flex flex-col py-2" aria-label="Mobile navigation">
              {siteConfig.nav.map((item) => (
                <Link key={item.to} to={item.to} className="px-5 py-3 text-sm font-medium text-charcoal hover:bg-brand-50 hover:text-brand">
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-muted-border" />
              <Link to={user && !isAdmin ? '/account' : '/login'} className="px-5 py-3 text-sm font-medium text-charcoal hover:bg-brand-50">
                {user && !isAdmin ? 'My Account' : 'Login / Sign up'}
              </Link>
              <Link to="/account/wishlist" className="px-5 py-3 text-sm font-medium text-charcoal hover:bg-brand-50">Wishlist</Link>
              {isAdmin && <Link to="/admin" className="px-5 py-3 text-sm font-medium text-accent-600 hover:bg-accent-50">Admin Dashboard</Link>}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
