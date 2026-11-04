import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Loading…' }: SpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-12 text-muted', className)}>
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  )
}
