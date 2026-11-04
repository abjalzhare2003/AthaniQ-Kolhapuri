import { Outlet } from 'react-router-dom'
import { StorefrontHeader } from '@/components/layout/StorefrontHeader'
import { StorefrontFooter } from '@/components/layout/StorefrontFooter'
import { ToastContainer } from '@/components/ui/Toast'

export function StorefrontLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <StorefrontFooter />
      <ToastContainer />
    </div>
  )
}
