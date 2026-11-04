import { Link } from 'react-router-dom'
import { getWholesaleProducts, getTotalStock } from '@/data/products'
import { getCategoryById } from '@/data/categories'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatCurrency } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'

export function WholesaleCatalog() {
  const products = getWholesaleProducts()

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Wholesale', to: '/wholesale/dashboard' }, { label: 'Catalogue' }]} />
      <h1 className="heading-serif text-2xl font-bold mb-1">Wholesale Catalogue</h1>
      <p className="text-sm text-muted mb-6">Bulk pricing for approved wholesale partners. Prices shown are per unit at the lowest tier.</p>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => {
          const category = getCategoryById(p.categoryId)
          const stock = getTotalStock(p)
          return (
            <Link key={p.id} to={`/wholesale/product/${p.slug}`} className="group card overflow-hidden transition-shadow hover:shadow-card">
              <div className="relative aspect-square overflow-hidden">
                <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105" loading="lazy" />
                {stock <= 5 && <span className="absolute top-3 left-3 badge bg-amber-500/90 text-white">Low stock: {stock}</span>}
              </div>
              <div className="p-4">
                <p className="text-xs text-muted">{category?.name}</p>
                <h3 className="font-serif text-sm font-medium text-charcoal group-hover:text-brand line-clamp-2">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted">From</div>
                    <div className="font-semibold text-brand">{formatCurrency(p.wholesalePrice ?? p.price)}</div>
                  </div>
                  <Badge variant="accent">MOQ: {p.moq}</Badge>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
