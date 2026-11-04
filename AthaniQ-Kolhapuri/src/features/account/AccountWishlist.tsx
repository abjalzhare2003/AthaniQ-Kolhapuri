import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { getProductById } from '@/data/products'
import { ProductCard } from '@/components/products/ProductCard'
import { EmptyState } from '@/components/ui/EmptyState'

export function AccountWishlist() {
  const navigate = useNavigate()
  const { wishlist } = useCartStore()
  const products = wishlist.map((w) => getProductById(w.productId)).filter(Boolean)

  if (products.length === 0) {
    return <EmptyState icon={Heart} title="Your wishlist is empty" message="Save items you love to find them later." action={{ label: 'Browse Products', onClick: () => navigate('/shop') }} />
  }

  return (
    <div>
      <h2 className="heading-serif text-lg font-semibold mb-4">My Wishlist ({products.length})</h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {products.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
