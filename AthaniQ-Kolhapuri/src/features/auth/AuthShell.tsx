import { NavLink } from 'react-router-dom'
import { placeholderImage } from '@/utils/placeholder'
import { cn } from '@/utils/cn'

interface AuthShellProps {
  children: React.ReactNode
  /** Hide the Login / Sign Up tabs (used on the forgot-password screen). */
  hideTabs?: boolean
}

const image = placeholderImage('Artisan heritage story', 2, 700, 900)

/** Split layout used by login, sign-up and forgot-password: photo panel + form card. */
export function AuthShell({ children, hideTabs }: AuthShellProps) {
  const tab = ({ isActive }: { isActive: boolean }) =>
    cn('flex-1 rounded-md py-2 text-center text-sm font-semibold transition-colors', isActive ? 'bg-brand text-white' : 'text-brand-600 hover:bg-brand-50')

  return (
    <div className="container-content py-8 sm:py-12">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-muted-border bg-ivory-50 shadow-card md:grid-cols-[1fr_1.1fr]">
        <div className="relative hidden min-h-[30rem] md:block">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-700/80 via-transparent to-transparent" aria-hidden />
          <p className="absolute bottom-6 left-6 right-6 font-serif text-xl leading-snug text-ivory">Handcrafted in Kolhapur, one pair at a time.</p>
        </div>
        <div className="p-6 sm:p-10">
          {!hideTabs && (
            <div className="mb-6 flex gap-1 rounded-lg bg-ivory-200 p-1" role="tablist">
              <NavLink to="/login" className={tab} role="tab">Login</NavLink>
              <NavLink to="/register" className={tab} role="tab">Sign Up</NavLink>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
