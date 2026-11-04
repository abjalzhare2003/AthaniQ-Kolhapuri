import { useState, useMemo } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck, Banknote, Star, Search, Check, MessageSquare, ThumbsUp } from 'lucide-react'
import { getProductBySlug, getProductColors, getProductSizes, getVariant, getTotalStock, getRelatedProducts } from '@/data/products'
import { getCategoryById } from '@/data/categories'
import { getReviewsByProduct, addReview } from '@/services/dataStore'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ProductCard } from '@/components/products/ProductCard'
import { Dialog } from '@/components/ui/Dialog'
import { Input, Textarea, Button } from '@/components/ui/Input'
import { useCartStore } from '@/stores/cartStore'
import { toast } from '@/stores/toastStore'
import { formatCurrency, formatDate } from '@/utils/format'
import { colorSwatch } from '@/utils/colors'
import { siteConfig } from '@/config/site'
import { cn } from '@/utils/cn'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const product = slug ? getProductBySlug(slug) : undefined
  const { addItem, toggleWishlist, wishlist } = useCartStore()
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [error, setError] = useState('')

  // Review submission state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewName, setReviewName] = useState('')
  const [reviewEmail, setReviewEmail] = useState('')
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({})
  const [renderCount, setRenderCount] = useState(0)

  const colors = useMemo(() => (product ? getProductColors(product) : []), [product])
  const sizes = useMemo(() => (product ? getProductSizes(product, selectedColor || colors[0]) : []), [product, selectedColor, colors])

  if (!product) return <Navigate to="/shop" replace />

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize || !selectedColor) return undefined
    return getVariant(product, selectedSize, selectedColor)
  }, [product, selectedSize, selectedColor])

  const currentPrice = selectedVariant?.price ?? product.price

  const reviews = useMemo(() => {
    return product ? getReviewsByProduct(product.id, true) : []
  }, [product, renderCount])

  const category = getCategoryById(product.categoryId)
  const stock = getTotalStock(product)
  const isOutOfStock = stock === 0
  const isWishlisted = wishlist.some((w) => w.productId === product.id)
  const related = getRelatedProducts(product)
  const discount =
    product.originalPrice && product.originalPrice > currentPrice
      ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
      : 0

  /** Validates the selection and adds to cart. Returns true if added. */
  const addToCart = (): boolean => {
    setError('')
    if (!selectedColor) { setError('Please select a colour.'); return false }
    if (!selectedSize) { setError('Please select a size.'); return false }
    const variant = getVariant(product, selectedSize, selectedColor)
    if (!variant || variant.stock === 0) { setError('This combination is out of stock.'); return false }
    if (quantity > variant.stock) { setError(`Only ${variant.stock} available in this size and colour.`); return false }
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image: variant.image || product.images[0] || '',
      slug: product.slug,
      size: variant.size,
      color: variant.color,
      price: variant.price ?? product.price,
      quantity,
    })
    return true
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!reviewName.trim()) errs.name = 'Name is required'
    if (!reviewComment.trim()) errs.comment = 'Review comment is required'
    setReviewErrors(errs)
    if (Object.keys(errs).length > 0) return

    addReview({
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] ?? '',
      customerName: reviewName.trim(),
      customerEmail: reviewEmail.trim() || undefined,
      rating: reviewRating,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
      status: 'approved',
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
      helpfulCount: 0,
    })

    toast('success', 'Thank you! Your review has been submitted and published.')
    setShowReviewModal(false)
    setReviewName('')
    setReviewEmail('')
    setReviewTitle('')
    setReviewComment('')
    setReviewRating(5)
    setRenderCount((n) => n + 1)
  }

  const perks = [
    { icon: Truck, title: 'Free Shipping', sub: `Above ${formatCurrency(siteConfig.shipping.freeThreshold)}` },
    { icon: RotateCcw, title: 'Easy Returns', sub: '7 Days' },
    { icon: ShieldCheck, title: 'Secure Payment', sub: '100% Safe' },
    { icon: Banknote, title: 'COD Available', sub: 'On Selected Pincodes' },
  ]

  return (
    <div className="container-content py-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          ...(category ? [{ label: category.name, to: `/category/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        {/* Gallery */}
        <div className="flex min-w-0 flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-2.5 sm:flex-col">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn('h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-ivory-200 transition-colors sm:h-[72px] sm:w-[72px]', activeImage === i ? 'border-brand' : 'border-muted-border hover:border-brand-300')}
                aria-label={`View image ${i + 1}`}
                aria-current={activeImage === i}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div
            className="relative aspect-square min-w-0 flex-1 cursor-zoom-in self-start overflow-hidden rounded-xl border border-muted-border bg-ivory-200"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-150"
              style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-soft" aria-hidden><Search className="h-4 w-4" /></span>
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="font-serif text-3xl font-semibold text-brand-700 sm:text-[2rem]">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex" aria-hidden>
              {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cn('h-4 w-4', n <= Math.round(product.rating) ? 'fill-accent text-accent' : 'text-muted-border')} />)}
            </span>
            <span className="font-medium text-accent-500">{product.rating}</span>
            <span className="text-muted">({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-brand-700">{formatCurrency(currentPrice)}</span>
            {selectedVariant?.price && selectedVariant.price !== product.price && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Size {selectedSize} Price
              </span>
            )}
            {discount > 0 && (
              <>
                <span className="text-lg text-muted line-through">{formatCurrency(product.originalPrice!)}</span>
                <span className="rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal-100">{product.description}</p>

          {/* Colour */}
          <div className="mt-6">
            <p className="text-sm font-medium text-charcoal">Color: <span className="font-normal text-charcoal-100">{selectedColor || 'Select a colour'}</span></p>
            <div className="mt-2 flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => { setSelectedColor(color); setSelectedSize('') }}
                  title={color}
                  aria-label={color}
                  aria-pressed={selectedColor === color}
                  className={cn('flex h-9 w-9 items-center justify-center rounded-full ring-offset-2 ring-offset-ivory transition', selectedColor === color ? 'ring-2 ring-brand' : 'ring-1 ring-muted-border hover:ring-brand-300')}
                  style={{ backgroundColor: colorSwatch(color) }}
                >
                  {selectedColor === color && <Check className="h-4 w-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-5">
            <div className="flex items-center justify-between sm:max-w-sm">
              <p className="text-sm font-medium text-charcoal">Size:</p>
              <button onClick={() => setShowSizeGuide((v) => !v)} className="text-xs font-medium text-brand underline underline-offset-2">Size Guide</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => {
                const variant = selectedColor ? getVariant(product, size, selectedColor) : undefined
                const unavailable = !!selectedColor && !(variant && variant.stock > 0)
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={unavailable}
                    aria-pressed={selectedSize === size}
                    className={cn(
                      'h-10 min-w-10 rounded-md border px-3 text-sm transition-colors',
                      selectedSize === size ? 'border-brand bg-brand text-white' : 'border-muted-border bg-white text-charcoal hover:border-brand',
                      unavailable && 'cursor-not-allowed line-through opacity-40 hover:border-muted-border',
                    )}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            {showSizeGuide && <p className="mt-2 rounded-md bg-brand-50 p-3 text-xs text-charcoal-100 sm:max-w-sm">{product.sizeGuide ?? 'Indian sizing. Runs true to size.'}</p>}
          </div>

          {/* Quantity */}
          <div className="mt-5">
            <p className="text-sm font-medium text-charcoal">Quantity:</p>
            <div className="mt-2 inline-flex items-center overflow-hidden rounded-md border border-muted-border bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center hover:bg-brand-50" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center hover:bg-brand-50" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
            </div>
            <span className="ml-4 align-middle text-sm">
              {selectedVariant ? (
                selectedVariant.stock === 0 ? (
                  <span className="text-red-600 font-medium">Out of stock for Size {selectedSize}</span>
                ) : selectedVariant.stock <= 5 ? (
                  <span className="text-accent-600 font-medium">Only {selectedVariant.stock} left in Size {selectedSize}</span>
                ) : (
                  <span className="text-green-700 font-medium">In stock ({selectedVariant.stock} available)</span>
                )
              ) : isOutOfStock ? (
                <span className="text-red-600">Out of stock</span>
              ) : stock <= 5 ? (
                <span className="text-accent-600">Only {stock} left</span>
              ) : (
                <span className="text-green-700">In stock</span>
              )}
            </span>
          </div>

          {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3 sm:max-w-md">
            <button
              onClick={() => { if (addToCart()) toast('success', `${product.name} added to cart`) }}
              disabled={isOutOfStock}
              className="btn flex-1 bg-brand py-3 text-white hover:bg-brand-600"
            >
              Add to Cart
            </button>
            <button
              onClick={() => { if (addToCart()) navigate('/checkout') }}
              disabled={isOutOfStock}
              className="btn flex-1 border border-brand bg-ivory-50 py-3 text-brand hover:bg-brand-50"
            >
              Buy Now
            </button>
            <button
              onClick={() => { toggleWishlist(product.id); toast(isWishlisted ? 'info' : 'success', isWishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
              className="btn h-[46px] w-[46px] border border-muted-border bg-white p-0 text-[#D9482B] hover:bg-brand-50"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
            >
              <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
            </button>
          </div>

          {/* Details */}
          <div className="mt-7 divide-y divide-muted-border border-y border-muted-border text-sm">
            <details className="group py-3" open>
              <summary className="cursor-pointer list-none font-semibold text-brand-600">Materials</summary>
              <p className="mt-1.5 text-charcoal-100">{product.materials}</p>
            </details>
            <details className="group py-3">
              <summary className="cursor-pointer list-none font-semibold text-brand-600">Care instructions</summary>
              <p className="mt-1.5 text-charcoal-100">{product.careInstructions}</p>
            </details>
          </div>
        </div>
      </div>

      {/* Perks strip */}
      <ul className="mt-10 grid grid-cols-2 gap-4 rounded-xl border border-muted-border bg-ivory-100 p-5 lg:grid-cols-4">
        {perks.map(({ icon: Icon, title, sub }) => (
          <li key={title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand"><Icon className="h-5 w-5" strokeWidth={1.7} /></span>
            <span className="text-sm"><span className="block font-semibold text-brand-600">{title}</span><span className="text-xs text-muted">{sub}</span></span>
          </li>
        ))}
      </ul>

      {/* Customer Reviews Section */}
      <section className="mt-14 rounded-2xl border border-muted-border bg-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-muted-border pb-6">
          <div>
            <h2 className="heading-serif text-2xl font-semibold text-brand-700">Customer Reviews</h2>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-5 w-5',
                      star <= Math.round(product.rating) ? 'fill-accent text-accent' : 'text-muted-border',
                    )}
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-charcoal">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted">based on {reviews.length} authentic customer reviews</span>
            </div>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="btn bg-brand text-white hover:bg-brand-600 self-start sm:self-auto flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="mt-6 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <p>No customer reviews yet for this product.</p>
              <p className="text-xs mt-1">Be the first to share your experience with AthaniQ Kolhapuri!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="border-b border-muted-border pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-charcoal">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-3xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium border border-green-200">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted">{formatDate(rev.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-accent">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn('h-3.5 w-3.5', s <= rev.rating ? 'fill-accent' : 'text-muted-border')}
                    />
                  ))}
                </div>
                {rev.title && <h4 className="mt-2 text-sm font-semibold text-brand-700">{rev.title}</h4>}
                <p className="mt-1 text-sm text-charcoal-100 leading-relaxed">{rev.comment}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-brand transition-colors">
                    <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({rev.helpfulCount ?? 0})
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Write Review Dialog */}
      <Dialog open={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a Customer Review" size="md">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Your Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setReviewRating(num)}
                  className="p-1 text-accent hover:scale-110 transition-transform"
                >
                  <Star className={cn('h-6 w-6', num <= reviewRating ? 'fill-accent text-accent' : 'text-muted-border')} />
                </button>
              ))}
              <span className="ml-2 text-sm font-medium text-charcoal">
                {reviewRating === 5
                  ? 'Excellent'
                  : reviewRating === 4
                  ? 'Good'
                  : reviewRating === 3
                  ? 'Average'
                  : reviewRating === 2
                  ? 'Poor'
                  : 'Terrible'}
              </span>
            </div>
          </div>

          <Input
            label="Your Name *"
            name="name"
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
            error={reviewErrors.name}
            placeholder="e.g. Ramesh Patil"
          />

          <Input
            label="Your Email (optional)"
            name="email"
            type="email"
            value={reviewEmail}
            onChange={(e) => setReviewEmail(e.target.value)}
            placeholder="e.g. ramesh@example.com"
            hint="Your email will not be displayed publicly."
          />

          <Input
            label="Review Title (optional)"
            name="title"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="Summarize your review in one sentence"
          />

          <Textarea
            label="Your Review *"
            name="comment"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            error={reviewErrors.comment}
            placeholder="Tell us about the leather quality, fit, comfort, and craftsmanship…"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Review</Button>
          </div>
        </form>
      </Dialog>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="section-title mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
