import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SearchX, SlidersHorizontal, X, Check } from 'lucide-react'
import { getProductColors } from '@/data/products'
import { getProducts } from '@/services/dataStore'
import { categories } from '@/data/categories'
import type { Product } from '@/types'
import { ProductCard } from '@/components/products/ProductCard'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { colorSwatch } from '@/utils/colors'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/utils/cn'

const ITEMS_PER_PAGE = 12
const PRICE_MIN = 0
const PRICE_MAX = 5000

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest' | 'popular'
type Material = 'Leather' | 'Suede' | 'Synthetic' | 'Other'

function materialOf(p: Product): Material {
  const m = p.materials.toLowerCase()
  if (m.includes('suede')) return 'Suede'
  if (m.includes('synthetic') || m.includes('rubber upper')) return 'Synthetic'
  if (m.includes('leather') || m.includes('cowhide')) return 'Leather'
  return 'Other'
}

function collectionTitle(slug: string, name: string): string {
  if (slug === 'accessories') return 'Accessories Collection'
  return `${name}${name.endsWith('s') ? "'" : "'s"} Collection`
}

function sizesOf(p: Product): string[] {
  return p.variants.map((v) => v.size)
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-muted-border pb-5 mb-5 last:border-0 last:mb-0">
      <h3 className="mb-3 text-sm font-semibold text-brand-600">{title}</h3>
      {children}
    </div>
  )
}

/** Shop listing. When `lockedCategory` is set (category pages) the category is fixed by the route. */
export function ShopPage({ lockedCategory }: { lockedCategory?: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const categorySlug = lockedCategory ?? searchParams.get('category') ?? ''
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<Material | ''>('')
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)

  const allProductsData = getProducts()
  const activeProducts = useMemo(() => allProductsData.filter((p) => p.status === 'active'), [allProductsData])
  const currentCategory = categories.find((c) => c.slug === categorySlug)

  // Facets are built from the products in scope (category + search), so options always make sense.
  const scoped = useMemo(() => {
    let r = activeProducts
    if (currentCategory) r = r.filter((p) => p.categoryId === currentCategory.id)
    if (search) {
      const q = search.toLowerCase()
      r = r.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    return r
  }, [activeProducts, currentCategory, search])

  const allColors = useMemo(() => [...new Set(scoped.flatMap(getProductColors))].sort(), [scoped])
  const allSizes = useMemo(
    () => [...new Set(scoped.flatMap(sizesOf))].filter((s) => /^\d+$/.test(s)).sort((a, b) => Number(a) - Number(b)),
    [scoped],
  )
  const materials = useMemo(() => {
    const counts = new Map<Material, number>()
    scoped.forEach((p) => counts.set(materialOf(p), (counts.get(materialOf(p)) ?? 0) + 1))
    return [...counts.entries()]
  }, [scoped])

  const filtered = useMemo(() => {
    let result = [...scoped]
    if (selectedColors.length) result = result.filter((p) => getProductColors(p).some((c) => selectedColors.includes(c)))
    if (selectedSizes.length) result = result.filter((p) => sizesOf(p).some((s) => selectedSizes.includes(s)))
    if (selectedMaterial) result = result.filter((p) => materialOf(p) === selectedMaterial)
    result = result.filter((p) => p.price <= maxPrice)

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break
    }
    return result
  }, [scoped, selectedColors, selectedSizes, selectedMaterial, maxPrice, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const activeFilterCount =
    (search ? 1 : 0) + selectedColors.length + selectedSizes.length + (selectedMaterial ? 1 : 0) + (maxPrice !== PRICE_MAX ? 1 : 0)

  const clearFilters = () => {
    setSearchParams({})
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedMaterial('')
    setMaxPrice(PRICE_MAX)
    setPage(1)
  }

  const toggle = <T,>(list: T[], v: T, set: (l: T[]) => void) => {
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
    setPage(1)
  }

  const title = currentCategory
    ? `${collectionTitle(currentCategory.slug, currentCategory.name)}`
    : search
      ? `Results for “${search}”`
      : 'All Products'

  const countFor = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug)
    return cat ? activeProducts.filter((p) => p.categoryId === cat.id).length : activeProducts.length
  }

  return (
    <div className="container-content py-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          ...(currentCategory ? [{ label: `${currentCategory.name} Collection` }] : [{ label: 'Shop' }]),
        ]}
      />

      <div className="flex gap-8">
        {/* Filter sidebar */}
        <aside
          className={cn(
            'lg:sticky lg:top-24 lg:block lg:w-60 lg:flex-shrink-0 lg:self-start lg:p-0',
            showFilters ? 'fixed inset-0 z-drawer overflow-y-auto bg-ivory-50 p-5' : 'hidden',
          )}
          aria-label="Filters"
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <h2 className="font-semibold text-brand-600">Filters</h2>
            <button onClick={() => setShowFilters(false)} aria-label="Close filters"><X className="h-5 w-5" /></button>
          </div>

          <div className="rounded-xl border border-muted-border bg-ivory-50 p-5">
            <FilterGroup title="Category">
              <ul className="space-y-1">
                {[{ slug: '', label: 'All' }, ...categories.map((c) => ({ slug: c.slug, label: c.name === 'Leather Accessories' ? 'Accessories' : c.name }))].map((c) => {
                  const active = (categorySlug || '') === c.slug
                  const common = cn('flex items-center justify-between rounded px-2 py-1.5 text-[13px] transition-colors', active ? 'bg-brand-50 font-semibold text-brand-600' : 'text-charcoal-100 hover:bg-muted-bg')
                  const inner = (<><span>{c.label}</span><span className="text-xs text-muted">({countFor(c.slug)})</span></>)
                  return (
                    <li key={c.slug || 'all'}>
                      {c.slug ? (
                        <Link to={`/category/${c.slug}`} className={common} aria-current={active ? 'page' : undefined}>{inner}</Link>
                      ) : (
                        <Link to="/shop" className={common} aria-current={active ? 'page' : undefined}>{inner}</Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </FilterGroup>

            <FilterGroup title="Price">
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={100}
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1) }}
                className="h-1.5 w-full cursor-pointer accent-brand"
                aria-label="Maximum price"
              />
              <div className="mt-2 flex justify-between text-xs text-charcoal-100">
                <span>{formatCurrency(PRICE_MIN)}</span>
                <span className="font-medium text-brand-600">Up to {formatCurrency(maxPrice)}</span>
              </div>
            </FilterGroup>

            {allSizes.length > 0 && (
              <FilterGroup title="Size">
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((s) => {
                    const on = selectedSizes.includes(s)
                    return (
                      <button key={s} onClick={() => toggle(selectedSizes, s, setSelectedSizes)} aria-pressed={on}
                        className={cn('h-8 min-w-8 rounded border px-2 text-xs transition-colors', on ? 'border-brand bg-brand text-white' : 'border-muted-border bg-white text-charcoal hover:border-brand')}>
                        {s}
                      </button>
                    )
                  })}
                </div>
              </FilterGroup>
            )}

            {allColors.length > 0 && (
              <FilterGroup title="Color">
                <div className="flex flex-wrap gap-2.5">
                  {allColors.map((c) => {
                    const on = selectedColors.includes(c)
                    return (
                      <button key={c} onClick={() => toggle(selectedColors, c, setSelectedColors)} title={c} aria-label={c} aria-pressed={on}
                        className={cn('flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 ring-offset-ivory-50 transition', on ? 'ring-2 ring-brand' : 'ring-1 ring-muted-border hover:ring-brand-300')}
                        style={{ backgroundColor: colorSwatch(c) }}>
                        {on && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
                      </button>
                    )
                  })}
                </div>
              </FilterGroup>
            )}

            {materials.length > 0 && (
              <FilterGroup title="Material">
                <div className="space-y-2">
                  {materials.map(([m]) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2 text-[13px] text-charcoal-100">
                      <input type="radio" name="material" checked={selectedMaterial === m}
                        onChange={() => { setSelectedMaterial(selectedMaterial === m ? '' : m); setPage(1) }}
                        onClick={() => selectedMaterial === m && setSelectedMaterial('')}
                        className="h-4 w-4 border-muted-border text-brand focus:ring-brand" />
                      {m}
                    </label>
                  ))}
                </div>
              </FilterGroup>
            )}

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm mt-4 w-full">Clear all filters ({activeFilterCount})</button>
            )}
          </div>
          <button onClick={() => setShowFilters(false)} className="btn btn-primary mt-4 w-full lg:hidden">Show {filtered.length} products</button>
        </aside>

        {/* Products */}
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-brand-700 sm:text-3xl">{title}</h1>
              <p className="mt-0.5 text-xs text-muted">{filtered.length} products</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(true)} className="btn btn-outline btn-sm lg:hidden">
                <SlidersHorizontal className="h-4 w-4" /> Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
              </button>
              <label className="flex items-center gap-2 text-sm text-charcoal-100">
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-md border border-muted-border bg-white py-1.5 pl-3 pr-8 text-sm focus:border-brand focus:outline-none"
                  aria-label="Sort by"
                >
                  <option value="popular">Popularity</option>
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </label>
            </div>
          </div>

          {paged.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No products found"
              message={search ? `No products match “${search}”. Try different words or clear your filters.` : 'No products match these filters. Try clearing them.'}
              action={{ label: 'Clear filters', onClick: clearFilters }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
                {paged.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {totalPages > 1 && <div className="mt-8"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
