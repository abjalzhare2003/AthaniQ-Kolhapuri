import { formatCurrency, discountPercent } from '@/utils/format'
import { cn } from '@/utils/cn'

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
}

export function PriceDisplay({ price, originalPrice, size = 'md', className }: PriceDisplayProps) {
  const discount = discountPercent(originalPrice ?? 0, price)

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-semibold text-charcoal', sizeClasses[size])}>
        {formatCurrency(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={cn('text-muted line-through', sizeClasses[size])}>
            {formatCurrency(originalPrice)}
          </span>
          {discount && (
            <span className="badge bg-brand-50 text-brand-500">
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </div>
  )
}
