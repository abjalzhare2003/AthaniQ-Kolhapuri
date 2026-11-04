import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Minus, Plus, AlertCircle, Check, FileText, ShoppingCart } from 'lucide-react'
import { getProductBySlug, getProductColors, getProductSizes, getVariant } from '@/data/products'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getWholesalePrice, meetsMoq, moqRemaining, calculateWholesaleLineTotal } from '@/lib/pricing'
import { formatCurrency } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import { addQuote } from '@/services/dataStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils/cn'

export function WholesaleProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductBySlug(slug) : undefined
  const { user } = useAuthStore()
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(product?.moq ?? 1)
  const [mode, setMode] = useState<'order' | 'quote'>('order')

  if (!product || !product.wholesaleEnabled) return <Navigate to="/wholesale/catalog" replace />

  const colors = getProductColors(product)
  const sizes = color ? getProductSizes(product, color) : []
  const unitPrice = getWholesalePrice(product, quantity)
  const lineTotal = calculateWholesaleLineTotal(product, quantity)
  const meetsMinimum = meetsMoq(product, quantity)
  const remaining = moqRemaining(product, quantity)

  const handleAddToOrder = () => {
    if (!color) { toast('error', 'Please select a colour'); return }
    if (!size) { toast('error', 'Please select a size'); return }
    if (!meetsMinimum) { toast('error', `Minimum order quantity is ${product.moq} units`); return }
    const variant = getVariant(product, size, color)
    if (!variant || variant.stock < quantity) { toast('error', 'Insufficient stock for this variant'); return }
    toast('success', `${quantity} × ${product.name} added to bulk order`)
  }

  const handleRequestQuote = () => {
    if (!color || !size) { toast('error', 'Please select colour and size'); return }
    if (!meetsMinimum) { toast('error', `Minimum order quantity is ${product.moq} units`); return }
    const variant = getVariant(product, size, color)
    if (!variant) { toast('error', 'Variant not found'); return }
    addQuote({
      id: `quote-${Date.now()}`,
      quoteRef: `AK-Q-2025-${String(Date.now()).slice(-6)}`,
      customerId: user?.id ?? 'guest',
      customerName: user ? `${user.firstName} ${user.lastName}` : 'Guest',
      items: [{
        productId: product.id, name: product.name, slug: product.slug, image: product.images[0] ?? '',
        variantId: variant.id, size: variant.size, color: variant.color,
        quantity, unitPrice, lineTotal,
      }],
      total: lineTotal,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    })
    toast('success', 'Quote request submitted! You can track it in Quote Requests.')
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Wholesale', to: '/wholesale/dashboard' }, { label: 'Catalogue', to: '/wholesale/catalog' }, { label: product.name }]} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted-bg"><img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" /></div>
        </div>
        <div>
          <h1 className="heading-serif text-2xl font-bold">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">{product.description}</p>

          {/* MOQ info */}
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="accent">MOQ: {product.moq} units</Badge>
            {product.wholesaleTiers && (
              <Badge variant="brand">{product.wholesaleTiers.length} price tiers</Badge>
            )}
          </div>

          {/* Price tiers */}
          {product.wholesaleTiers && (
            <div className="mt-4 rounded-lg border border-muted-border overflow-hidden">
              <div className="bg-muted-bg px-4 py-2 text-xs font-semibold">Quantity-Based Pricing</div>
              <div className="divide-y divide-muted-border">
                {product.wholesaleTiers.map((tier, i) => (
                  <div key={i} className={cn('flex items-center justify-between px-4 py-2.5 text-sm', quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty) ? 'bg-brand-50' : '')}>
                    <span>{tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units</span>
                    <span className={cn('font-semibold', quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty) ? 'text-brand' : '')}>{formatCurrency(tier.price)}/unit</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color selection */}
          <div className="mt-4">
            <label className="label-base">Colour</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button key={c} onClick={() => { setColor(c); setSize('') }} className={cn('rounded-lg border px-4 py-2 text-sm transition-colors', color === c ? 'border-brand bg-brand-50 text-brand-500' : 'border-muted-border hover:border-charcoal')}>{c}</button>
              ))}
            </div>
          </div>

          {/* Size */}
          {color && (
            <div className="mt-4">
              <label className="label-base">Size</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => { const v = getVariant(product, s, color); return (
                  <button key={s} onClick={() => setSize(s)} disabled={!v || v.stock === 0} className={cn('min-w-[3rem] rounded-lg border px-3 py-2 text-sm transition-colors', size === s ? 'border-brand bg-brand-50 text-brand-500' : 'border-muted-border', (!v || v.stock === 0) && 'opacity-40 cursor-not-allowed line-through')}>{s}</button>
                )})}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-4">
            <label className="label-base">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-muted-border hover:bg-muted-bg" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="input-base w-24 text-center" min={1} aria-label="Quantity" />
              <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-muted-border hover:bg-muted-bg" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            {!meetsMinimum && <p className="mt-1 text-sm text-amber-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Add {remaining} more to meet MOQ of {product.moq}</p>}
            {meetsMinimum && <p className="mt-1 text-sm text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> Meets minimum order quantity</p>}
          </div>

          {/* Line total */}
          <div className="mt-4 rounded-lg bg-muted-bg p-4">
            <div className="flex justify-between text-sm"><span className="text-muted">Unit price (at {quantity} units)</span><span className="font-medium">{formatCurrency(unitPrice)}</span></div>
            <div className="flex justify-between font-semibold text-lg mt-1"><span>Line total</span><span>{formatCurrency(lineTotal)}</span></div>
          </div>

          {/* Mode toggle */}
          <div className="mt-4 flex gap-2">
            <button onClick={() => setMode('order')} className={cn('flex-1 rounded-lg border p-3 text-center text-sm font-medium transition-colors', mode === 'order' ? 'border-brand bg-brand-50 text-brand-500' : 'border-muted-border hover:border-charcoal')}>
              <ShoppingCart className="h-4 w-4 mx-auto mb-1" /> Add to Order
            </button>
            <button onClick={() => setMode('quote')} className={cn('flex-1 rounded-lg border p-3 text-center text-sm font-medium transition-colors', mode === 'quote' ? 'border-brand bg-brand-50 text-brand-500' : 'border-muted-border hover:border-charcoal')}>
              <FileText className="h-4 w-4 mx-auto mb-1" /> Request Quote
            </button>
          </div>

          {mode === 'order' ? (
            <Button onClick={handleAddToOrder} className="w-full mt-3" disabled={!meetsMinimum}>Add to Bulk Order</Button>
          ) : (
            <Button onClick={handleRequestQuote} className="w-full mt-3" disabled={!meetsMinimum}>Submit Quote Request</Button>
          )}
        </div>
      </div>
    </div>
  )
}
