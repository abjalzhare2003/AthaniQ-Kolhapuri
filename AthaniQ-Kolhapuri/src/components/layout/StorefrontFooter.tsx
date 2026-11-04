import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Twitter, ArrowRight, Check } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { Logo } from '@/components/ui/Logo'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', to: '/category/men' },
      { label: 'Women', to: '/category/women' },
      { label: 'Kids', to: '/category/kids' },
      { label: 'Accessories', to: '/category/accessories' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', to: '/faq' },
      { label: 'Returns', to: '/policies/returns' },
      { label: 'Shipping', to: '/policies/shipping' },
      { label: 'Track Order', to: '/account/orders' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Story', to: '/about' },
      { label: 'Wholesale', to: '/wholesale' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
]

export function StorefrontFooter() {
  const [subscribed, setSubscribed] = useState(false)
  const social = [
    { icon: Facebook, href: siteConfig.brand.social.facebook, label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: siteConfig.brand.social.instagram, label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  return (
    <footer className="mt-16 bg-gradient-to-b from-brand-600 to-brand-700 text-ivory">
      <div className="container-content py-12">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)_1.6fr]">
          <div>
            <Logo tone="light" size="lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
              Authentic Kolhapuri chappals handcrafted by skilled artisans of Kolhapur.
            </p>
            <div className="mt-5 flex gap-2.5">
              {social.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-accent hover:bg-accent hover:text-brand-700"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-sans text-sm font-semibold text-accent-300">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ivory/75 transition-colors hover:text-accent-200">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 font-sans text-sm font-semibold text-accent-300">Subscribe to our Newsletter</h3>
            {subscribed ? (
              <p className="flex items-center gap-2 rounded-md bg-ivory/10 px-3 py-2.5 text-sm"><Check className="h-4 w-4 text-accent-300" /> Thanks — you're on the list.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true) }} className="flex overflow-hidden rounded-md bg-ivory-50">
                <input type="email" required placeholder="Enter your email" aria-label="Email address" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-charcoal placeholder:text-muted focus:outline-none" />
                <button type="submit" className="flex w-11 items-center justify-center bg-accent text-brand-700 hover:bg-accent-500" aria-label="Subscribe"><ArrowRight className="h-4 w-4" /></button>
              </form>
            )}
            <div className="mt-5 flex items-center gap-2" aria-label="Accepted payments">
              <span className="rounded bg-white px-2.5 py-1 text-xs font-bold italic text-[#1A1F71]">VISA</span>
              <span className="flex h-[26px] items-center rounded bg-white px-2"><span className="h-4 w-4 rounded-full bg-[#EB001B]" /><span className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B] opacity-90" /></span>
              <span className="rounded bg-white px-2.5 py-1 text-xs font-bold italic text-[#097939]">UPI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/15">
        <div className="container-content flex flex-col items-center justify-between gap-1 py-4 text-xs text-ivory/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Athaniq Kolhapur. All rights reserved.</p>
          <p>Demo storefront · sample data shown</p>
        </div>
      </div>
    </footer>
  )
}
