import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cartStore'
import { getTotalStock } from '@/data/products'
import { formatCurrency } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import { cn } from '@/utils/cn'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addItem } = useCartStore()
  const isWishlisted = wishlist.some((w) => w.productId === product.id)
  const stock = getTotalStock(product)
  const isLowStock = stock > 0 && stock <= 5
  const isOutOfStock = stock === 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    const firstVariant = product.variants.find((v) => v.stock > 0)
    if (!firstVariant) return
    addItem({
      productId: product.id,
      variantId: firstVariant.id,
      name: product.name,
      image: product.images[0] ?? '',
      slug: product.slug,
      size: firstVariant.size,
      color: firstVariant.color,
      price: firstVariant.price ?? product.price,
      quantity: 1,
    })
    toast('success', `${product.name} added to cart`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist(product.id)
  }

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-muted-border bg-ivory-50 transition-shadow duration-slow hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-ivory-200">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
          loading="lazy"
        />
        {isOutOfStock && <span className="absolute left-2.5 top-2.5 badge bg-charcoal/85 text-white">Out of stock</span>}
        {isLowStock && <span className="absolute left-2.5 top-2.5 badge bg-accent text-brand-700">Only {stock} left</span>}
        {discount > 0 && !isLowStock && !isOutOfStock && (
          <span className="absolute left-2.5 top-2.5 badge bg-brand text-white">{discount}% OFF</span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#D9482B] shadow-soft transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isWishlisted}
        >
          <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] font-sans text-[13px] font-medium leading-snug text-charcoal">{product.name}</h3>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-brand-600">{formatCurrency(product.price)}</span>
              {discount > 0 && <span className="text-xs text-muted line-through">{formatCurrency(product.originalPrice!)}</span>}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px]">
              <Star className="h-3 w-3 fill-accent text-accent" aria-hidden />
              <span className="font-medium text-accent-500">{product.rating}</span>
              <span className="text-muted">({product.reviewCount})</span>
            </div>
          </div>
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-brand text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
