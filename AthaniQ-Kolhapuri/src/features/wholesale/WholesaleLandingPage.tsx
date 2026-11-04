import { Link } from 'react-router-dom'
import { Tag, Boxes, FileText, Truck, Check, Percent, PackageOpen, Receipt } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { placeholderImage } from '@/utils/placeholder'
import { toast } from '@/stores/toastStore'

const heroPoints = ['Special pricing for retailers', 'Bulk order discounts', 'Dedicated business support']

const services = [
  { icon: Percent, label: 'Bulk Pricing' },
  { icon: PackageOpen, label: 'Custom Orders' },
  { icon: Receipt, label: 'GST Billing' },
  { icon: Truck, label: 'Timely Delivery' },
]

export function WholesaleLandingPage() {
  return (
    <div>
      <div className="container-content pt-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wholesale' }]} />
      </div>

      {/* Hero */}
      <section className="container-content">
        <div className="banner-brown relative overflow-hidden rounded-2xl">
          <div className="grid items-center md:grid-cols-[1.1fr_1fr]">
            <div className="px-6 py-10 sm:px-12 sm:py-14">
              <h1 className="font-serif text-4xl font-semibold text-ivory sm:text-5xl">Buy in Wholesale</h1>
              <p className="mt-2 font-serif text-lg text-accent-200 sm:text-xl">Grow Your Business with Athaniq</p>
              <ul className="mt-5 space-y-2 text-sm text-ivory/90">
                {heroPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent-300" aria-hidden />{p}</li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/wholesale/register" className="btn bg-accent px-6 py-2.5 font-semibold text-brand-700 hover:bg-accent-300">Enquire for Wholesale</Link>
                <button
                  onClick={() => toast('info', 'The wholesale catalogue is shared once your application is approved.')}
                  className="btn border border-ivory/40 px-6 py-2.5 text-ivory hover:bg-ivory/10"
                >
                  Download Catalogue
                </button>
              </div>
            </div>
            <div className="relative h-56 md:h-full md:min-h-[22rem]">
              <img src={placeholderImage('Wholesale Kolhapuri', 0, 800, 600)} alt="" className="absolute inset-0 h-full w-full object-cover md:[mask-image:linear-gradient(to_right,transparent,black_30%)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="container-content py-8">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {services.map(({ icon: Icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-2 text-center text-sm font-medium text-brand-600">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-muted-border bg-ivory-50 text-brand"><Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden /></span>
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Why partner */}
      <section className="container-content py-8">
        <h2 className="section-title mb-6">Why Partner With Us</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Tag, title: 'Competitive Bulk Pricing', text: 'Wholesale prices well below retail, with quantity-based tier discounts.' },
            { icon: Boxes, title: 'Flexible MOQs', text: 'Minimum order quantities start from 6 units, tailored to your business.' },
            { icon: FileText, title: 'Quote Requests', text: 'Request quotations for large orders and get personalised pricing within 24 hours.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-muted-border bg-ivory-50 p-6">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand"><item.icon className="h-5 w-5" /></span>
              <h3 className="font-sans text-base font-semibold text-brand-600">{item.title}</h3>
              <p className="mt-1 text-sm text-charcoal-100">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-10">
        <div className="container-content">
          <h2 className="section-title mb-6">How It Works</h2>
          <ol className="grid gap-5 sm:grid-cols-3">
            {[
              { title: 'Apply', text: 'Fill out the wholesale registration form with your business details.' },
              { title: 'Get approved', text: 'Our team reviews your application within 2–3 business days.' },
              { title: 'Start buying', text: 'Open the wholesale catalogue, see bulk pricing and place orders.' },
            ].map((item, i) => (
              <li key={item.title} className="rounded-xl border border-muted-border bg-ivory-100 p-6">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand font-semibold text-white">{i + 1}</span>
                <h3 className="font-sans font-semibold text-brand-600">{item.title}</h3>
                <p className="mt-1 text-sm text-charcoal-100">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* MOQ & tiers */}
      <section className="container-content py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-muted-border bg-ivory-50 p-6">
            <h2 className="font-serif text-xl font-semibold text-brand-700">Minimum Order Quantity</h2>
            <p className="mt-2 text-sm text-charcoal-100">Each product has a minimum order quantity (MOQ), typically 6 to 48 units, to qualify for wholesale pricing.</p>
            <ul className="mt-4 space-y-2 text-sm text-charcoal-100">
              {['MOQ starts from 6 units', 'Mix and match sizes within a product', 'MOQ is shown on each product page'].map((point) => (
                <li key={point} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" />{point}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-muted-border bg-ivory-50 p-6">
            <h2 className="font-serif text-xl font-semibold text-brand-700">Quantity-Based Pricing</h2>
            <p className="mt-2 text-sm text-charcoal-100">The more you order, the less you pay per unit.</p>
            <table className="mt-4 w-full overflow-hidden rounded-lg text-sm">
              <thead className="bg-brand text-left text-ivory"><tr><th className="px-3 py-2 font-medium">Quantity</th><th className="px-3 py-2 text-right font-medium">Price / unit</th></tr></thead>
              <tbody className="divide-y divide-muted-border bg-ivory-100">
                <tr><td className="px-3 py-2">12–23 units</td><td className="px-3 py-2 text-right">₹750</td></tr>
                <tr><td className="px-3 py-2">24–47 units</td><td className="px-3 py-2 text-right">₹690</td></tr>
                <tr><td className="px-3 py-2 font-medium text-green-700">48+ units</td><td className="px-3 py-2 text-right font-medium text-green-700">₹620</td></tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-muted">Sample pricing — actual prices vary by product.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-content pb-10 pt-4">
        <div className="banner-brown rounded-2xl px-8 py-10 text-center">
          <h2 className="font-serif text-3xl font-semibold text-ivory">Ready to get started?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ivory/80">Apply for a wholesale account and stock authentic Kolhapuri footwear.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/wholesale/register" className="btn bg-accent px-7 py-2.5 font-semibold text-brand-700 hover:bg-accent-300">Apply Now</Link>
            <Link to="/wholesale/status" className="btn border border-ivory/40 px-7 py-2.5 text-ivory hover:bg-ivory/10">Check Application Status</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
