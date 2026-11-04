import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { cn } from '@/utils/cn'

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3–5 business days across India. Express delivery (1–2 days) is available for select pin codes at checkout.' },
      { q: 'Do you ship internationally?', a: 'Currently, we ship within India only. International shipping is coming soon.' },
      { q: 'What are the shipping charges?', a: 'Flat ₹100 shipping on all orders. Orders above ₹2,000 qualify for free shipping.' },
      { q: 'How can I track my order?', a: 'Once your order is shipped, you will receive a tracking reference via email. You can also track it from your account under My Orders.' },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      { q: 'What is your return policy?', a: 'We offer 7-day returns. If you are not satisfied with your purchase, you can return it within 7 days of delivery for a refund or exchange.' },
      { q: 'How do I request a return?', a: 'Go to My Account → Returns, select the order and items you wish to return, and submit a return request with your reason.' },
      { q: 'Can I exchange for a different size?', a: 'Yes, size exchanges are free. Simply request a return and place a new order for the correct size.' },
    ],
  },
  {
    category: 'Product & Sizing',
    items: [
      { q: 'How do I find the right size?', a: 'Each product page includes a size guide. Kolhapuri chappals use Indian sizing and generally run true to size.' },
      { q: 'Are the colours shown accurate?', a: 'We do our best to represent colours accurately, but actual shades may vary slightly due to lighting and screen settings.' },
      { q: 'How should I care for my Kolhapuri?', a: 'Wipe with a damp cloth, apply leather conditioner every 2–3 months, and store away from direct sunlight.' },
    ],
  },
  {
    category: 'Wholesale',
    items: [
      { q: 'How do I become a wholesale buyer?', a: 'Register through our Wholesale Portal by completing the business application form. Our team will review and respond within 2–3 business days.' },
      { q: 'What is the minimum order quantity (MOQ)?', a: 'MOQ varies by product, typically ranging from 6 to 48 units. Each product in the wholesale catalogue displays its specific MOQ.' },
      { q: 'Do you offer quantity-based pricing?', a: 'Yes. Many products have tiered pricing — the more you order, the lower the per-unit price.' },
    ],
  },
]

export function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="container-narrow py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
      <h1 className="heading-serif text-4xl font-bold text-center">Frequently Asked Questions</h1>
      <p className="mt-2 text-center text-muted">Find answers to common questions about our products and services.</p>

      <div className="mt-10 space-y-8">
        {faqs.map((group) => (
          <div key={group.category}>
            <h2 className="heading-serif text-xl font-semibold mb-3">{group.category}</h2>
            <div className="space-y-2">
              {group.items.map((item, i) => {
                const id = `${group.category}-${i}`
                const isOpen = openId === id
                return (
                  <div key={id} className="card overflow-hidden">
                    <button
                      onClick={() => setOpenId(isOpen ? null : id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-medium text-charcoal">{item.q}</span>
                      <ChevronDown className={cn('h-5 w-5 flex-shrink-0 text-muted transition-transform', isOpen && 'rotate-180')} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-muted leading-relaxed animate-fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted italic">[Sample FAQ content — to be verified by the client.]</p>
    </div>
  )
}
