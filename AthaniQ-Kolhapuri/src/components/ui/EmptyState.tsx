import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-border py-16 px-6 text-center">
      <Icon className="h-12 w-12 text-muted mb-4" aria-hidden />
      <h3 className="heading-serif text-xl mb-1">{title}</h3>
      <p className="text-muted text-sm max-w-sm mb-6">{message}</p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </div>
  )
}
