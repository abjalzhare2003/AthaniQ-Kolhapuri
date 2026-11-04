import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
}

export function Dialog({ open, onClose, title, children, className, size = 'md' }: DialogProps) {
  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="absolute inset-0 bg-charcoal/50 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          'relative z-10 w-full rounded-2xl bg-white shadow-elevated animate-scale-in',
          sizeClasses[size],
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-muted-border px-6 py-4">
          <h2 id="dialog-title" className="heading-serif text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-muted-bg hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
