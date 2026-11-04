import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  backTo?: string
  backLabel?: string
  actions?: React.ReactNode
}

export function AdminPageHeader({ title, description, backTo, backLabel, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      {backTo && (
        <Link
          to={backTo}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel ?? 'Back'}
        </Link>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
