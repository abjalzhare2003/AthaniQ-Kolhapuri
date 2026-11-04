import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'
import type { ToastVariant } from '@/stores/toastStore'
import { cn } from '@/utils/cn'

const toastConfig: Record<ToastVariant, { icon: React.ReactNode; containerClass: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden />,
    containerClass: 'bg-white border-l-4 border-green-500',
  },
  error: {
    icon: <AlertCircle className="h-5 w-5 text-red-600" aria-hidden />,
    containerClass: 'bg-white border-l-4 border-red-500',
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-600" aria-hidden />,
    containerClass: 'bg-white border-l-4 border-blue-500',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />,
    containerClass: 'bg-white border-l-4 border-amber-500',
  },
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-toast flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const { icon, containerClass } = toastConfig[t.variant]
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 shadow-elevated animate-fade-up',
              containerClass,
            )}
            role="alert"
          >
            {icon}
            <p className="flex-1 text-sm text-charcoal">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 text-muted hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
