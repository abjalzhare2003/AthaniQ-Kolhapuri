import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Check, Truck } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore, getCurrentCustomer } from '@/stores/authStore'
import { calculateCartTotals } from '@/lib/pricing'
import { formatCurrency } from '@/utils/format'
import { createRetailOrder } from '@/services/orderService'
import { Input, Select } from '@/components/ui/Input'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { cn } from '@/utils/cn'
import { toast } from '@/stores/toastStore'
import type { Address } from '@/types'

const paymentOptions = [
  { value: 'UPI', label: 'UPI', hint: 'Google Pay, PhonePe, Paytm' },
  { value: 'Credit Card', label: 'Credit / Debit Card', hint: 'Visa, Mastercard, RuPay' },
  { value: 'Net Banking', label: 'Net Banking', hint: 'All major banks' },
  { value: 'Cash on Delivery', label: 'Cash on Delivery (COD)', hint: 'Pay when it arrives' },
]

const deliveryOptions = [
  { name: 'Standard Delivery (3-5 days)', expressCost: false },
  { name: 'Express Delivery (1-2 days)', expressCost: true },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const customer = getCurrentCustomer()
  const defaultAddr = customer?.addresses.find((a) => a.isDefault) ?? customer?.addresses[0]

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' '),
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    pincode: defaultAddr?.pincode ?? '',
    line1: defaultAddr?.line1 ?? '',
    city: defaultAddr?.city ?? '',
    state: defaultAddr?.state ?? '',
  })
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryOptions[0]!.name)
  const [paymentMethod, setPaymentMethod] = useState('UPI')

  const totals = calculateCartTotals(items, null)

  if (items.length === 0) {
    return (
      <div className="container-content py-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
        <div className="rounded-xl border border-muted-border bg-ivory-50 p-10 text-center">
          <p className="text-muted">Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary mt-4 inline-flex">Browse Products</Link>
        </div>
      </div>
    )
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.fullName.trim()) errs.fullName = 'Enter your full name'
    if (!form.email) errs.email = 'Enter your email'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.phone.trim()) errs.phone = 'Enter your phone number'
    if (!form.pincode) errs.pincode = 'Enter your pincode'
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Pincode must be 6 digits'
    if (!form.line1.trim()) errs.line1 = 'Enter your address'
    if (!form.city.trim()) errs.city = 'Enter your city'
    if (!form.state) errs.state = 'Select your state'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const addressDone =
    !!form.fullName.trim() && /^\S+@\S+\.\S+$/.test(form.email) && !!form.phone.trim() && /^\d{6}$/.test(form.pincode) && !!form.line1.trim() && !!form.city.trim() && !!form.state

  const handlePlaceOrder = () => {
    if (!validate()) {
      toast('error', 'Please complete the delivery address.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const [firstName, ...rest] = form.fullName.trim().split(/\s+/)
      const shippingAddress: Address = {
        id: `addr-${Date.now()}`,
        label: 'Shipping',
        fullName: form.fullName.trim(),
        line1: form.line1,
        line2: '',
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone,
        isDefault: false,
      }
      const order = createRetailOrder({
        customerId: user?.id ?? 'guest',
        customerName: [firstName, ...rest].join(' '),
        customerEmail: form.email,
        items,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        shippingAddress,
        deliveryMethod,
        paymentMethod,
      })
      clearCart()
      setLoading(false)
      toast('success', 'Order placed successfully!')
      navigate(`/order-confirmation/${order.id}`)
    }, 800)
  }

  const steps = [
    { label: 'Cart', done: true, active: false },
    { label: 'Address', done: addressDone, active: !addressDone },
    { label: 'Payment', done: false, active: addressDone },
  ]

  return (
    <div className="container-content py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      <ol className="mx-auto mb-8 flex max-w-xl items-center" aria-label="Checkout progress">
        {steps.map((s, i) => (
          <li key={s.label} className="flex flex-1 items-center last:flex-none">
            <span className="flex items-center gap-2 text-sm font-medium" aria-current={s.active ? 'step' : undefined}>
              <span className={cn('flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs', s.done ? 'border-brand bg-brand text-white' : s.active ? 'border-brand text-brand' : 'border-muted-border text-muted')}>
                {s.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={s.done || s.active ? 'text-brand-600' : 'text-muted'}>{s.label}</span>
            </span>
            {i < steps.length - 1 && <span className={cn('mx-3 h-px flex-1', s.done ? 'bg-brand' : 'bg-muted-border')} />}
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <section className="rounded-xl border border-muted-border bg-ivory-50 p-5 sm:p-6" aria-labelledby="addr-title">
          <h1 id="addr-title" className="font-serif text-xl font-semibold text-brand-700">Delivery Address</h1>
          <div className="mt-4 space-y-4">
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={set('fullName')} error={errors.fullName} autoComplete="name" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone Number" name="phone" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="+91 98765 43210" autoComplete="tel" />
              <Input label="Pincode" name="pincode" value={form.pincode} onChange={set('pincode')} error={errors.pincode} maxLength={6} inputMode="numeric" autoComplete="postal-code" />
            </div>
            <Input label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            <Input label="Address" name="line1" value={form.line1} onChange={set('line1')} error={errors.line1} autoComplete="street-address" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" name="city" value={form.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
              <Select label="State" name="state" value={form.state} onChange={set('state')} error={errors.state}>
                <option value="">Select state</option>
                <option>Maharashtra</option><option>Karnataka</option><option>Gujarat</option><option>Goa</option><option>Delhi</option><option>Tamil Nadu</option><option>Other</option>
              </Select>
            </div>
          </div>

          <h2 className="mt-7 font-serif text-lg font-semibold text-brand-700">Delivery Method</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery method">
            {deliveryOptions.map((o) => {
              const cost = o.expressCost ? 200 : totals.subtotal >= 2000 ? 0 : 100
              const on = deliveryMethod === o.name
              return (
                <button key={o.name} type="button" role="radio" aria-checked={on} onClick={() => setDeliveryMethod(o.name)}
                  className={cn('flex items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm transition-colors', on ? 'border-brand bg-brand-50' : 'border-muted-border bg-white hover:border-brand-300')}>
                  <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-brand" />{o.name.replace(' Delivery', '')}</span>
                  <span className="text-xs font-semibold">{cost === 0 ? 'Free' : formatCurrency(cost)}</span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="space-y-6 self-start lg:sticky lg:top-24">
          <section className="rounded-xl border border-muted-border bg-ivory-50 p-5 sm:p-6" aria-labelledby="pay-title">
            <h2 id="pay-title" className="font-serif text-xl font-semibold text-brand-700">Payment Method</h2>
            <div className="mt-4 space-y-2.5" role="radiogroup" aria-label="Payment method">
              {paymentOptions.map((o) => (
                <label key={o.value} className={cn('flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors', paymentMethod === o.value ? 'border-brand bg-brand-50' : 'border-muted-border bg-white hover:border-brand-300')}>
                  <input type="radio" name="payment" value={o.value} checked={paymentMethod === o.value} onChange={() => setPaymentMethod(o.value)} className="h-4 w-4 border-muted-border text-brand focus:ring-brand" />
                  <span><span className="block font-medium text-charcoal">{o.label}</span><span className="text-xs text-muted">{o.hint}</span></span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">Demo checkout — no real payment is taken and no card details are collected.</p>
          </section>

          <section className="rounded-xl border border-muted-border bg-ivory-50 p-5 sm:p-6" aria-label="Order summary">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-charcoal-100">Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)</dt><dd>{formatCurrency(totals.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-100">Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal-100">Est. tax</dt><dd>{formatCurrency(totals.tax)}</dd></div>
            </dl>
            <button onClick={handlePlaceOrder} disabled={loading} className="btn mt-4 w-full justify-between bg-brand px-5 py-3 text-white hover:bg-brand-600">
              <span>{loading ? 'Placing order…' : 'Place Order'}</span>
              <span className="font-bold">{formatCurrency(totals.total)}</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
