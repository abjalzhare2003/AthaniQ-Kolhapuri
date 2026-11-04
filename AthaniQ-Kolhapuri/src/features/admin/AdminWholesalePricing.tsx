import { useState } from 'react'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { getProducts, upsertProduct } from '@/services/dataStore'
import { Input, Button } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import { Plus } from 'lucide-react'
import type { WholesaleTier } from '@/types'

export function AdminWholesalePricing() {
  const [, forceRender] = useState(0)
  const wholesaleProducts = getProducts().filter((p) => p.wholesaleEnabled)

  const handleSave = (productId: string, field: string, value: string | number) => {
    const product = getProducts().find((p) => p.id === productId)
    if (!product) return
    upsertProduct({ ...product, [field]: value })
    forceRender((n) => n + 1)
    toast('success', 'Pricing updated')
  }

  const updateTier = (productId: string, index: number, field: keyof WholesaleTier, value: string | number | null) => {
    const product = getProducts().find((p) => p.id === productId)
    if (!product?.wholesaleTiers) return
    const tiers = [...product.wholesaleTiers]
    if (!tiers[index]) return
    tiers[index] = { ...tiers[index], [field]: value }
    upsertProduct({ ...product, wholesaleTiers: tiers })
    forceRender((n) => n + 1)
  }

  const addTier = (productId: string) => {
    const product = getProducts().find((p) => p.id === productId)
    if (!product?.wholesaleTiers) return
    const newTier: WholesaleTier = { minQty: (product.wholesaleTiers[product.wholesaleTiers.length - 1]?.maxQty ?? 0) + 1, maxQty: null, price: product.wholesalePrice ?? 0 }
    upsertProduct({ ...product, wholesaleTiers: [...product.wholesaleTiers, newTier] })
    forceRender((n) => n + 1)
  }

  return (
    <div>
      <AdminPageHeader title="Wholesale Pricing" description="Manage wholesale prices, MOQs, and quantity tiers" />
      <div className="space-y-4">
        {wholesaleProducts.map((p) => (
          <div key={p.id} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="font-serif font-semibold">{p.name}</h2><p className="text-xs text-muted">Retail: {formatCurrency(p.price)}</p></div>
              <Badge variant="accent">MOQ: {p.moq}</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className="label-base">Wholesale Base Price (₹)</label>
                <Input name="wholesalePrice" type="number" defaultValue={p.wholesalePrice ?? 0} onBlur={(e) => handleSave(p.id, 'wholesalePrice', Number(e.target.value))} />
              </div>
              <div>
                <label className="label-base">Minimum Order Quantity</label>
                <Input name="moq" type="number" defaultValue={p.moq ?? 1} onBlur={(e) => handleSave(p.id, 'moq', Number(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="label-base">Quantity Tiers</label>
              <div className="space-y-2">
                {p.wholesaleTiers?.map((tier, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-muted-border p-2">
                    <Input type="number" className="w-24" placeholder="Min" value={tier.minQty} onChange={(e) => updateTier(p.id, i, 'minQty', Number(e.target.value))} aria-label="Min qty" />
                    <span className="text-muted">to</span>
                    <Input type="number" className="w-24" placeholder="Max" value={tier.maxQty ?? ''} onChange={(e) => updateTier(p.id, i, 'maxQty', e.target.value ? Number(e.target.value) : null)} aria-label="Max qty" />
                    <span className="text-muted">@</span>
                    <Input type="number" className="w-28" placeholder="Price" value={tier.price} onChange={(e) => updateTier(p.id, i, 'price', Number(e.target.value))} aria-label="Price" />
                    <span className="text-sm text-muted">/unit</span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => addTier(p.id)}><Plus className="h-3 w-3" /> Add Tier</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted italic">[Wholesale pricing changes update the demo state. The backend must validate pricing in production.]</p>
    </div>
  )
}
