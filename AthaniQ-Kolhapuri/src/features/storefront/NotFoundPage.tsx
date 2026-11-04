import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="heading-serif text-7xl font-bold text-brand">404</h1>
      <h2 className="mt-2 heading-serif text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted">The page you're looking for doesn't exist or has been moved.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn btn-primary"><Home className="h-4 w-4" /> Go Home</Link>
        <Link to="/shop" className="btn btn-outline"><Search className="h-4 w-4" /> Browse Shop</Link>
      </div>
    </div>
  )
}
