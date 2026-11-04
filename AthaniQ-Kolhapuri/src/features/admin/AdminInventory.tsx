import { useState } from 'react'
import {
  Search,
  AlertTriangle,
  Boxes,
  History,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  getProducts,
  updateVariantStock,
  getInventoryAdjustments,
  getCategories,
} from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Input, Button, Select } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { formatDateTime } from '@/utils/format'
import { colorSwatch } from '@/utils/colors'
import { toast } from '@/stores/toastStore'
import { cn } from '@/utils/cn'

export function AdminInventory() {
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState<'all' | 'low_stock' | 'out_of_stock' | 'in_stock'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [adjust, setAdjust] = useState<{
    variantId: string
    productId: string
    productName: string
    sku: string
    size: string
    color: string
    currentStock: number
  } | null>(null)

  const [newStock, setNewStock] = useState(0)
  const [reason, setReason] = useState('New restock received from artisan workshop')
  const [customReason, setCustomReason] = useState('')
  const [, forceRender] = useState(0)

  const categories = getCategories()
  const products = getProducts()

  const allVariants = products
    .flatMap((p) => p.variants.map((v) => ({ product: p, variant: v })))
    .filter((item) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchName = item.product.name.toLowerCase().includes(q)
        const matchSku = item.variant.sku.toLowerCase().includes(q)
        const matchColor = item.variant.color.toLowerCase().includes(q)
        const matchSize = item.variant.size.toLowerCase().includes(q)
        if (!matchName && !matchSku && !matchColor && !matchSize) return false
      }

      // Category
      if (categoryFilter !== 'all' && item.product.categoryId !== categoryFilter) {
        return false
      }

      // Stock status
      if (stockFilter === 'out_of_stock' && item.variant.stock > 0) return false
      if (stockFilter === 'low_stock' && (item.variant.stock === 0 || item.variant.stock > 5)) return false
      if (stockFilter === 'in_stock' && item.variant.stock <= 5) return false

      return true
    })

  const adjustments = getInventoryAdjustments()

  // Counters
  const totalUnits = products.reduce(
    (sum, p) => sum + p.variants.reduce((s, v) => s + v.stock, 0),
    0,
  )
  const lowStockCount = products.reduce(
    (sum, p) => sum + p.variants.filter((v) => v.stock > 0 && v.stock <= 5).length,
    0,
  )
  const outOfStockCount = products.reduce(
    (sum, p) => sum + p.variants.filter((v) => v.stock === 0).length,
    0,
  )

  const openAdjust = (item: {
    variantId: string
    productId: string
    productName: string
    sku: string
    size: string
    color: string
    currentStock: number
  }) => {
    setAdjust(item)
    setNewStock(item.currentStock)
    setReason('New restock received from artisan workshop')
    setCustomReason('')
  }

  const handleAdjust = () => {
    if (!adjust) return
    if (newStock < 0) {
      toast('error', 'Stock quantity cannot be negative.')
      return
    }

    const finalReason = reason === 'Other' && customReason.trim() ? customReason.trim() : reason
    updateVariantStock(adjust.productId, adjust.variantId, newStock, finalReason)
    setAdjust(null)
    forceRender((n) => n + 1)
    toast('success', `Stock updated for SKU ${adjust.sku}`)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inventory Management"
        description="Monitor variant-level stock levels, low-stock thresholds, and record stock adjustment logs"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Boxes className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-charcoal">{totalUnits}</div>
            <div className="text-xs text-muted">Total Footwear Pairs in Stock</div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700">{lowStockCount}</div>
            <div className="text-xs text-muted">Low Stock Variants (≤ 5 units left)</div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-700">{outOfStockCount}</div>
            <div className="text-xs text-muted">Out of Stock Variants (0 units)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product, SKU, size, color…"
              className="input-base pl-9 text-sm"
            />
          </div>

          <Select
            name="stockFilter"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
          >
            <option value="all">All Stock Statuses</option>
            <option value="low_stock">Low Stock Alerts (≤ 5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
            <option value="in_stock">Healthy Stock (&gt; 5)</option>
          </Select>

          <Select
            name="categoryFilter"
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
        </div>

        <div className="flex items-center justify-between text-xs text-muted pt-1 border-t border-muted-border">
          <span>
            Displaying <strong>{allVariants.length}</strong> variants across catalogue
          </span>
          {(search || stockFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setStockFilter('all')
                setCategoryFilter('all')
              }}
              className="text-brand hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Variant Inventory Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted-bg border-b border-muted-border text-xs font-semibold text-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Size</th>
                <th className="px-4 py-3.5">Color</th>
                <th className="px-4 py-3.5">Available Stock</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border">
              {allVariants.map(({ product, variant }) => {
                const isOutOfStock = variant.stock === 0
                const isLowStock = variant.stock > 0 && variant.stock <= 5

                return (
                  <tr key={variant.id} className="hover:bg-muted-bg/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-charcoal">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={variant.image || product.images[0] || ''}
                          alt=""
                          className="h-9 w-9 rounded-md object-cover bg-ivory-100 border border-muted-border flex-shrink-0"
                        />
                        <span className="truncate max-w-xs">{product.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-xs text-muted">{variant.sku}</td>

                    <td className="px-4 py-3 font-bold text-charcoal">Size {variant.size}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: colorSwatch(variant.color) }}
                        />
                        <span>{variant.color}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-sm font-bold',
                          isOutOfStock
                            ? 'text-red-600'
                            : isLowStock
                            ? 'text-amber-600'
                            : 'text-charcoal',
                        )}
                      >
                        {variant.stock} pairs
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-3xs font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                          <XCircle className="h-3 w-3" /> Out of stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-3xs font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          <AlertTriangle className="h-3 w-3" /> Low stock alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-3xs font-bold uppercase px-2 py-0.5 rounded bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3" /> In stock
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          openAdjust({
                            variantId: variant.id,
                            productId: product.id,
                            productName: product.name,
                            sku: variant.sku,
                            size: variant.size,
                            color: variant.color,
                            currentStock: variant.stock,
                          })
                        }
                        className="text-xs"
                      >
                        Adjust Stock
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {allVariants.length === 0 && (
            <div className="p-12 text-center text-muted">No inventory records found.</div>
          )}
        </div>
      </div>

      {/* Recent Inventory Adjustments Log */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-muted-border pb-3">
          <History className="h-5 w-5 text-brand" />
          <h2 className="heading-serif text-lg font-semibold text-charcoal">
            Inventory Movement & Audit History
          </h2>
        </div>

        {adjustments.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">
            No stock adjustments recorded yet. Adjustments made above will log here with date and reason.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted-bg text-muted font-semibold">
                <tr>
                  <th className="px-3 py-2">Timestamp</th>
                  <th className="px-3 py-2">Product & SKU</th>
                  <th className="px-3 py-2">Change</th>
                  <th className="px-3 py-2">New Balance</th>
                  <th className="px-3 py-2">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-border">
                {adjustments.slice(0, 10).map((adj) => {
                  const delta = adj.newStock - adj.previousStock
                  return (
                    <tr key={adj.id} className="hover:bg-muted-bg/50">
                      <td className="px-3 py-2 text-muted">{formatDateTime(adj.createdAt)}</td>
                      <td className="px-3 py-2 font-medium text-charcoal">
                        {adj.productName}{' '}
                        <span className="text-muted font-mono">({adj.sku ?? adj.variantId})</span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            'font-bold px-1.5 py-0.5 rounded text-3xs',
                            delta > 0
                              ? 'bg-green-100 text-green-700'
                              : delta < 0
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700',
                          )}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-bold text-charcoal">{adj.newStock}</td>
                      <td className="px-3 py-2 text-muted">{adj.reason}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Stock Dialog */}
      <Dialog
        open={!!adjust}
        onClose={() => setAdjust(null)}
        title={`Adjust Stock — ${adjust?.sku ?? ''}`}
        size="md"
      >
        {adjust && (
          <div className="space-y-4">
            <div className="rounded-xl bg-ivory-100 p-4 space-y-1 text-sm border border-muted-border">
              <div className="font-semibold text-brand-700">{adjust.productName}</div>
              <div className="text-xs text-muted">
                Size: <strong>{adjust.size}</strong> · Color: <strong>{adjust.color}</strong> · SKU:{' '}
                <strong>{adjust.sku}</strong>
              </div>
              <div className="text-xs text-muted pt-1">
                Current stock on record: <strong className="text-charcoal">{adjust.currentStock} units</strong>
              </div>
            </div>

            <Input
              label="New Stock Quantity *"
              name="newStock"
              type="number"
              min={0}
              value={newStock}
              onChange={(e) => setNewStock(Math.max(0, Number(e.target.value)))}
              hint="Enter the authoritative count of physical units available."
            />

            <Select
              label="Reason for Adjustment *"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option>New restock received from artisan workshop</option>
              <option>Physical inventory count reconciliation</option>
              <option>Damaged / defective item written off</option>
              <option>Customer return accepted back to stock</option>
              <option>Correction of previous entry error</option>
              <option>Other</option>
            </Select>

            {reason === 'Other' && (
              <Input
                label="Custom Reason Description"
                name="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Explain the reason for adjustment…"
              />
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-muted-border">
              <Button variant="ghost" onClick={() => setAdjust(null)}>
                Cancel
              </Button>
              <Button onClick={handleAdjust}>Save Stock Adjustment</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
