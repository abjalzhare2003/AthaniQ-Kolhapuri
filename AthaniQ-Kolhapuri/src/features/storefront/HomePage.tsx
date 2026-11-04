import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShieldCheck, Hammer, Landmark, Truck, Check } from 'lucide-react'
import { getBestsellers } from '@/data/products'
import { categories } from '@/data/categories'
import { ProductCard } from '@/components/products/ProductCard'
import { placeholderImage } from '@/utils/placeholder'
import { cn } from '@/utils/cn'

const bannerUrl = (file: string) => `${import.meta.env.BASE_URL}banners/${file}`

// Banner images live in /public/banners. Text and buttons are part of each image,
// so each slide is a single clickable image.
const slides = [
  { alt: 'Authentic Kolhapuri Chappals - Explore Collection', image: bannerUrl('banner-1-store-hero.png'), to: '/shop', fit: 'cover' as const },
  { alt: 'A Collection for Every Step - Shop by Category', image: bannerUrl('banner-2-collections.png'), to: '/shop', fit: 'cover' as const },
  { alt: 'Crafted by Hand, Rooted in Tradition - Watch Our Process', image: bannerUrl('banner-3-craftsmanship.png'), to: '/about', fit: 'contain' as const },
  { alt: 'Premium Leather Accessories - Explore Accessories', image: bannerUrl('banner-4-leather-accessories.png'), to: '/category/accessories', fit: 'cover' as const },
  { alt: 'Grow Your Business with ATHANIQ - Explore Wholesale', image: bannerUrl('banner-5-wholesale.png'), to: '/wholesale', fit: 'cover' as const },
]

const trust = [
  { icon: ShieldCheck, label: 'Genuine Leather' },
  { icon: Hammer, label: 'Handcrafted' },
  { icon: Landmark, label: 'Traditional Design' },
  { icon: Truck, label: 'Pan India Delivery' },
]

const collectionNames: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  kids: "Kids' Collection",
  accessories: 'Bags & Accessories',
}

export function HomePage() {
  const [slide, setSlide] = useState(0)
  const bestsellers = getBestsellers().slice(0, 4)
  const [paused, setPaused] = useState(false)
  const go = (dir: number) => setSlide((s) => (s + dir + slides.length) % slides.length)

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <div>
      {/* Hero banner slider */}
      <section className="container-content pt-5">
        <div
          className="relative overflow-hidden rounded-2xl border border-muted-border bg-ivory-100"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative aspect-[4.35/1] w-full">
            {slides.map((s, i) => (
              <Link
                key={s.image}
                to={s.to}
                aria-label={s.alt}
                aria-hidden={i !== slide}
                tabIndex={i === slide ? 0 : -1}
                className={cn(
                  'absolute inset-0 block transition-opacity duration-700',
                  i === slide ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                {s.fit === 'contain' && (
                  /* very wide banner: blurred copy fills the spare space above/below */
                  <img src={s.image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl" />
                )}
                <img
                  src={s.image}
                  alt={s.alt}
                  className={cn('relative h-full w-full', s.fit === 'cover' ? 'object-cover' : 'object-contain')}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </Link>
            ))}
          </div>

          <button onClick={() => go(-1)} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-700/70 text-white backdrop-blur hover:bg-brand-700 md:h-10 md:w-10" aria-label="Previous slide"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={() => go(1)} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-700/70 text-white backdrop-blur hover:bg-brand-700 md:h-10 md:w-10" aria-label="Next slide"><ChevronRight className="h-5 w-5" /></button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((s, i) => (
              <button key={s.image} role="tab" aria-selected={i === slide} aria-label={`Slide ${i + 1}`} onClick={() => setSlide(i)} className={cn('h-2 rounded-full transition-all', i === slide ? 'w-6 bg-brand' : 'w-2 bg-brand/40')} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="container-content py-6">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trust.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-2.5 text-sm font-medium text-brand-600">
              <Icon className="h-6 w-6 text-accent-500" strokeWidth={1.6} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Shop by Collection */}
      <section className="container-content py-8">
        <h2 className="section-title">Shop by Collection</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.filter((c) => c.active).map((cat) => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="group overflow-hidden rounded-xl border border-muted-border bg-ivory-200 transition-shadow hover:shadow-card">
              <div className="aspect-[5/4] overflow-hidden">
                <img src={cat.image} alt="" className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105" loading="lazy" />
              </div>
              <div className="bg-ivory-100 px-3 py-3 text-center font-sans text-sm font-medium text-brand-600">
                {collectionNames[cat.slug] ?? cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="container-content py-8">
          <h2 className="section-title">Bestsellers</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-6 text-center">
            <Link to="/shop" className="text-sm font-medium text-brand underline-offset-4 hover:underline">View all products</Link>
          </div>
        </section>
      )}

      {/* Wholesale Partner Program */}
      <section className="container-content py-8">
        <div className="banner-brown relative overflow-hidden rounded-2xl">
          <div className="grid items-center md:grid-cols-[1.2fr_1fr]">
            <div className="px-6 py-9 sm:px-10">
              <h2 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl">Wholesale Partner Program</h2>
              <p className="mt-2 text-sm text-ivory/80 sm:text-base">Bulk Orders • Special Pricing • Business Support</p>
              <Link to="/wholesale" className="btn mt-6 bg-accent px-6 py-2.5 font-semibold text-brand-700 hover:bg-accent-300">Enquire for Wholesale</Link>
            </div>
            <div className="relative hidden h-full min-h-[11rem] md:block">
              <img src={placeholderImage('Wholesale Kolhapuri', 0, 700, 420)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 [mask-image:linear-gradient(to_right,transparent,black_35%)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Legacy */}
      <section className="container-content py-8">
        <div className="grid items-center gap-6 overflow-hidden rounded-2xl border border-muted-border bg-ivory-100 md:grid-cols-[1fr_1.2fr]">
          <img src={placeholderImage('Artisan heritage story', 0, 800, 420)} alt="Kolhapuri artisan's workshop, illustrated" className="h-56 w-full object-cover md:h-full" loading="lazy" />
          <div className="px-6 py-8 sm:px-10">
            <h2 className="font-serif text-3xl font-semibold text-brand-700">Our Legacy</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-100">
              A rich tradition of handcrafted footwear from Kolhapur, preserving artistry for generations.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-charcoal-100">
              {['Vegetable-tanned leather', 'Stitched and finished by hand', 'Made by artisan families of Kolhapur'].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent-500" aria-hidden />{t}</li>
              ))}
            </ul>
            <Link to="/about" className="btn mt-6 border border-brand px-6 py-2 text-brand hover:bg-brand hover:text-white">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
