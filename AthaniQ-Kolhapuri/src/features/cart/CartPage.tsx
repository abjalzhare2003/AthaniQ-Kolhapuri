import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { calculateCartTotals } from '@/lib/pricing'
import { formatCurrency } from '@/utils/format'
import { EmptyState } from '@/components/ui/EmptyState'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export function CartPage() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity } = useCartStore()
  const totals = calculateCartTotals(items, null)
  const count = items.reduce((n, i) => n + i.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="container-content py-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState icon={ShoppingBag} title="Your cart is empty" message="Add a pair to get started — every one is handcrafted in Kolhapur." action={{ label: 'Continue Shopping', onClick: () => navigate('/shop') }} />
      </div>
    )
  }

  const qtyBtn = 'flex h-7 w-7 items-center justify-center hover:bg-brand-50'

  return (
    <div className="container-content py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <section className="rounded-xl border border-muted-border bg-ivory-50 p-5 sm:p-6" aria-labelledby="cart-title">
          <h1 id="cart-title" className="font-serif text-2xl font-semibold text-brand-700">Your Cart ({count} {count === 1 ? 'Item' : 'Items'})</h1>
          <ul className="mt-4 divide-y divide-muted-border">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-4 py-4">
                <Link to={`/product/${item.slug}`} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-ivory-200">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <Link to={`/product/${item.slug}`} className="block truncate text-sm font-semibold text-charcoal hover:text-brand">{item.name}</Link>
                    <p className="mt-0.5 text-xs text-muted">Size: {item.size} | Color: {item.color}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-5 sm:mt-0 sm:justify-end">
                    <div className="inline-flex items-center overflow-hidden rounded-md border border-muted-border bg-white text-sm">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className={qtyBtn} aria-label={`Decrease quantity of ${item.name}`}><Minus className="h-3 w-3" /></button>
                      <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className={qtyBtn} aria-label={`Increase quantity of ${item.name}`}><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="w-20 text-right text-sm font-bold text-brand-700">{formatCurrency(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.variantId)} className="text-[#C2452B] transition-opacity hover:opacity-70" aria-label={`Remove ${item.name}`}><Trash2 className="h-[18px] w-[18px]" /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">← Continue shopping</Link>
        </section>

        <aside className="self-start rounded-xl border border-muted-border bg-ivory-50 p-5 sm:p-6 lg:sticky lg:top-24" aria-label="Order summary">
          <h2 className="font-serif text-xl font-semibold text-brand-700">Order Summary</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-charcoal-100">Subtotal</dt><dd className="font-medium">{formatCurrency(totals.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-charcoal-100">Shipping</dt><dd className="font-medium">{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-charcoal-100">Est. tax</dt><dd className="font-medium">{formatCurrency(totals.tax)}</dd></div>
            <div className="flex justify-between border-t border-muted-border pt-3 text-base"><dt className="font-semibold text-brand-700">Total</dt><dd className="font-bold text-brand-700">{formatCurrency(totals.total)}</dd></div>
          </dl>
          <Link to="/checkout" className="btn mt-5 w-full bg-brand py-3 text-white hover:bg-brand-600">Proceed to Checkout</Link>
          <p className="mt-3 text-center text-xs text-muted">Shipping and tax are confirmed at checkout.</p>
        </aside>
      </div>
    </div>
  )
}
