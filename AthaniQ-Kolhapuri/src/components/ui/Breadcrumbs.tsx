import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="hover:text-brand transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-charcoal font-medium' : ''}>{crumb.label}</span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
