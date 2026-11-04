import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Package,
} from 'lucide-react'
import { getProducts, deleteProduct, upsertProduct, getCategories } from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Button, Select } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { formatCurrency } from '@/utils/format'
import { routes } from '@/config/routes'
import { toast } from '@/stores/toastStore'
import { cn } from '@/utils/cn'
import type { Product } from '@/types'

export function AdminProducts() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all')
  const [wholesaleFilter, setWholesaleFilter] = useState<'all' | 'wholesale_only'>('all')
  const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null)
  const [, forceRender] = useState(0)

  const categories = getCategories()
  const allProducts = getProducts()

  const filteredProducts = allProducts.filter((p) => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchName = p.name.toLowerCase().includes(q)
      const matchSku = p.variants.some((v) => v.sku.toLowerCase().includes(q))
      const matchCat = categories.find((c) => c.id === p.categoryId)?.name.toLowerCase().includes(q)
      if (!matchName && !matchSku && !matchCat) return false
    }

    // Category
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) {
      return false
    }

    // Status
    if (statusFilter !== 'all' && p.status !== statusFilter) {
      return false
    }

    // Wholesale
    if (wholesaleFilter === 'wholesale_only' && !p.wholesaleEnabled) {
      return false
    }

    // Stock
    const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
    if (stockFilter === 'out_of_stock' && totalStock > 0) return false
    if (stockFilter === 'low_stock' && (totalStock === 0 || totalStock > 10)) return false
    if (stockFilter === 'in_stock' && totalStock === 0) return false

    return true
  })

  const handleDelete = () => {
    if (!deleteProductTarget) return
    deleteProduct(deleteProductTarget.id)
    toast('success', `Product "${deleteProductTarget.name}" deleted.`)
    setDeleteProductTarget(null)
    forceRender((n) => n + 1)
  }

  const handleTogglePublish = (p: Product) => {
    const newStatus = p.status === 'active' ? 'draft' : 'active'
    upsertProduct({ ...p, status: newStatus })
    toast('info', `Product "${p.name}" is now ${newStatus === 'active' ? 'Published' : 'Draft'}`)
    forceRender((n) => n + 1)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description="Manage your footwear catalogue, sizing variants, prices, and stock"
        actions={
          <Link to={routes.adminProductNew}>
            <Button size="sm" className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name, SKU…"
              className="input-base pl-9 text-sm"
            />
          </div>

          {/* Category */}
          <Select
            name="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          {/* Status */}
          <Select
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Published)</option>
            <option value="draft">Draft (Hidden)</option>
          </Select>

          {/* Stock */}
          <Select
            name="stock"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock (≤ 10)</option>
            <option value="out_of_stock">Out of Stock</option>
          </Select>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-muted-border text-xs text-muted">
          <span>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{allProducts.length}</strong> products
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setWholesaleFilter((curr) => (curr === 'all' ? 'wholesale_only' : 'all'))
              }
              className={cn(
                'px-2.5 py-1 rounded-full border transition flex items-center gap-1',
                wholesaleFilter === 'wholesale_only'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-white text-muted border-muted-border hover:border-brand',
              )}
            >
              Wholesale Only
            </button>
            {(search ||
              categoryFilter !== 'all' ||
              statusFilter !== 'all' ||
              stockFilter !== 'all' ||
              wholesaleFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategoryFilter('all')
                  setStatusFilter('all')
                  setStockFilter('all')
                  setWholesaleFilter('all')
                }}
                className="text-brand hover:underline font-medium ml-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted-bg border-b border-muted-border text-xs font-semibold text-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Product & SKU</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Retail Price</th>
                <th className="px-4 py-3.5">Variants & Sizes</th>
                <th className="px-4 py-3.5">Total Stock</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border">
              {filteredProducts.map((p) => {
                const category = categories.find((c) => c.id === p.categoryId)
                const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
                const distinctSizes = [...new Set(p.variants.map((v) => v.size))].sort()
                const distinctColors = [...new Set(p.variants.map((v) => v.color))]

                // Variant prices range
                const prices = p.variants.map((v) => v.price ?? p.price)
                const minPrice = Math.min(...prices)
                const maxPrice = Math.max(...prices)
                const hasPriceRange = minPrice !== maxPrice

                return (
                  <tr key={p.id} className="hover:bg-muted-bg/40 transition-colors">
                    {/* Product Name & SKU */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0] ?? ''}
                          alt=""
                          className="h-12 w-12 rounded-lg object-cover bg-ivory-100 border border-muted-border flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/products/${p.id}`}
                            className="font-semibold text-charcoal hover:text-brand transition truncate block"
                          >
                            {p.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted font-mono">{p.variants[0]?.sku ?? p.id}</span>
                            {p.featured && (
                              <span className="text-3xs bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded border border-amber-200">
                                Featured
                              </span>
                            )}
                            {p.wholesaleEnabled && (
                              <span className="text-3xs bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded border border-blue-200">
                                B2B
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-muted text-sm">{category?.name ?? '—'}</td>

                    {/* Price & Variant Price Range */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-charcoal">
                        {hasPriceRange
                          ? `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`
                          : formatCurrency(p.price)}
                      </div>
                      {hasPriceRange && (
                        <div className="text-3xs text-brand font-medium">Size-based pricing</div>
                      )}
                    </td>

                    {/* Sizing & Variants */}
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-charcoal">
                        Sizes: {distinctSizes.join(', ') || 'Standard'}
                      </div>
                      <div className="text-3xs text-muted">
                        {distinctColors.length} {distinctColors.length === 1 ? 'color' : 'colors'} (
                        {p.variants.length} {p.variants.length === 1 ? 'variant' : 'variants'})
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                          totalStock === 0
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : totalStock <= 10
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-green-50 text-green-700 border border-green-200',
                        )}
                      >
                        {totalStock === 0 ? 'Out of stock' : `${totalStock} units`}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={cn(
                          'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full transition',
                          p.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                        )}
                        title={`Click to ${p.status === 'active' ? 'unpublish' : 'publish'}`}
                      >
                        {p.status === 'active' ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-gray-500" /> Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/product/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded text-muted hover:text-brand hover:bg-brand-50 transition"
                          title="Preview on Storefront"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="p-1.5 rounded text-muted hover:text-brand hover:bg-brand-50 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteProductTarget(p)}
                          className="p-1.5 rounded text-muted hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-muted space-y-2">
              <Package className="h-10 w-10 mx-auto text-muted/50" />
              <p className="font-medium text-charcoal">No products match the selected criteria.</p>
              <p className="text-xs">Try clearing the filters or adding a new product.</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={!!deleteProductTarget}
        onClose={() => setDeleteProductTarget(null)}
        title="Confirm Product Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-charcoal-100">
            Are you sure you want to delete <strong>"{deleteProductTarget?.name}"</strong>?
          </p>
          <p className="text-xs text-muted">
            This will remove the product and all associated variants from the catalogue. Existing customer orders
            containing this product will preserve their purchase snapshots.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setDeleteProductTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Product
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
