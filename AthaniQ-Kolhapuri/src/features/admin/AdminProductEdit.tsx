import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Upload,
  Plus,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Input, Textarea, Select, Button } from '@/components/ui/Input'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Dialog } from '@/components/ui/Dialog'
import { getProducts, upsertProduct, getCategories } from '@/services/dataStore'
import { footwearImagePresets } from '@/utils/imagePresets'
import { colorSwatch } from '@/utils/colors'
import { formatCurrency } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import { routes } from '@/config/routes'
import type { Product, ProductVariant, WholesaleTier } from '@/types'

const PRESET_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12']
const PRESET_COLORS = ['Tan', 'Dark Brown', 'Honey Tan', 'Black', 'Gold', 'Maroon', 'Natural Leather']

export function AdminProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const existing = id ? getProducts().find((p) => p.id === id) : undefined
  const isNew = !existing

  const categories = getCategories()

  // Form Basic Info
  const [name, setName] = useState(existing?.name ?? '')
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? categories[0]?.id ?? 'cat-men')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [careInstructions, setCareInstructions] = useState(existing?.careInstructions ?? '')
  const [materials, setMaterials] = useState(existing?.materials ?? '')
  const [basePrice, setBasePrice] = useState(String(existing?.price ?? ''))
  const [originalPrice, setOriginalPrice] = useState(String(existing?.originalPrice ?? ''))
  const [status, setStatus] = useState<'active' | 'draft'>(existing?.status ?? 'active')
  const [featured, setFeatured] = useState(existing?.featured ?? false)
  const [bestseller, setBestseller] = useState(existing?.bestseller ?? false)
  const [newArrival, setNewArrival] = useState(existing?.newArrival ?? false)

  // Images state (Multiple images)
  const [images, setImages] = useState<string[]>(
    existing?.images && existing.images.length > 0
      ? existing.images
      : ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80'],
  )
  const [newImageUrl, setNewImageUrl] = useState('')
  const [showPresetPicker, setShowPresetPicker] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Variants & Size-based pricing state
  const [variants, setVariants] = useState<ProductVariant[]>(
    existing?.variants && existing.variants.length > 0
      ? existing.variants
      : [
          {
            id: `v-${Date.now()}-1`,
            productId: existing?.id ?? 'temp',
            size: '6',
            color: 'Tan',
            sku: 'AK-GEN-6-TAN',
            price: 899,
            stock: 12,
            active: true,
          },
          {
            id: `v-${Date.now()}-2`,
            productId: existing?.id ?? 'temp',
            size: '7',
            color: 'Tan',
            sku: 'AK-GEN-7-TAN',
            price: 949,
            stock: 10,
            active: true,
          },
          {
            id: `v-${Date.now()}-3`,
            productId: existing?.id ?? 'temp',
            size: '8',
            color: 'Tan',
            sku: 'AK-GEN-8-TAN',
            price: 999,
            stock: 8,
            active: true,
          },
        ],
  )

  // Variant generator quick inputs
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['6', '7', '8', '9'])
  const [selectedColors, setSelectedColors] = useState<string[]>(['Tan', 'Dark Brown'])
  const [customSize, setCustomSize] = useState('')
  const [customColor, setCustomColor] = useState('')
  const [bulkPrice, setBulkPrice] = useState('')
  const [bulkStock, setBulkStock] = useState('')

  // Wholesale state
  const [wholesaleEnabled, setWholesaleEnabled] = useState(existing?.wholesaleEnabled ?? false)
  const [wholesalePrice, setWholesalePrice] = useState(String(existing?.wholesalePrice ?? ''))
  const [moq, setMoq] = useState(String(existing?.moq ?? '6'))
  const [tiers, setTiers] = useState<WholesaleTier[]>(
    existing?.wholesaleTiers ?? [
      { minQty: 6, maxQty: 11, price: 650 },
      { minQty: 12, maxQty: 23, price: 590 },
      { minQty: 24, maxQty: null, price: 540 },
    ],
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'variants' | 'wholesale'>('details')

  // ─── Image Manager Actions ───────────────────────────────────

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string])
          toast('success', `Added image: ${file.name}`)
        }
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return
    setImages((prev) => [...prev, newImageUrl.trim()])
    setNewImageUrl('')
    toast('success', 'Image URL added')
  }

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      toast('error', 'A product must have at least one image.')
      return
    }
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSetPrimary = (index: number) => {
    if (index === 0) return
    const updated = [...images]
    const [selected] = updated.splice(index, 1)
    if (selected) {
      updated.unshift(selected)
      setImages(updated)
      toast('info', 'Primary image updated')
    }
  }

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= images.length) return
    const updated = [...images]
    const temp = updated[index]!
    updated[index] = updated[targetIndex]!
    updated[targetIndex] = temp
    setImages(updated)
  }

  // ─── Variant Matrix Generator ────────────────────────────────

  const generateCombinations = () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      toast('error', 'Please select at least one size and one color to generate variants.')
      return
    }

    const defaultPrice = Number(basePrice) || 999
    const baseSkuPrefix =
      name
        .trim()
        .slice(0, 3)
        .toUpperCase() || 'AK'

    const newVariants: ProductVariant[] = []

    selectedSizes.forEach((sz, sizeIndex) => {
      // Step pricing demonstration: size 6=899, size 7=949, size 8=999 (+₹50 per size step above base)
      const stepPrice = defaultPrice + (sizeIndex - 1) * 50

      selectedColors.forEach((col) => {
        const skuCol = col.replace(/\s+/g, '').slice(0, 3).toUpperCase()
        const sku = `AK-${baseSkuPrefix}-${sz}-${skuCol}`

        // Check if combination already exists to preserve custom edits
        const existingComb = variants.find((v) => v.size === sz && v.color === col)
        if (existingComb) {
          newVariants.push(existingComb)
        } else {
          newVariants.push({
            id: `v-${Date.now()}-${sz}-${col}`,
            productId: existing?.id ?? 'temp',
            size: sz,
            color: col,
            sku,
            price: stepPrice > 0 ? stepPrice : defaultPrice,
            stock: 10,
            active: true,
          })
        }
      })
    })

    setVariants(newVariants)
    toast('success', `Generated ${newVariants.length} variant combinations.`)
  }

  const handleAddSingleVariant = () => {
    const sz = customSize.trim() || '8'
    const col = customColor.trim() || 'Tan'
    const defaultP = Number(basePrice) || 999

    setVariants((prev) => [
      ...prev,
      {
        id: `v-${Date.now()}`,
        productId: existing?.id ?? 'temp',
        size: sz,
        color: col,
        sku: `AK-${sz}-${col.replace(/\s+/g, '').toUpperCase()}`,
        price: defaultP,
        stock: 5,
        active: true,
      },
    ])
    setCustomSize('')
    setCustomColor('')
    toast('success', `Added variant ${sz} / ${col}`)
  }

  const handleUpdateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)))
  }

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      toast('error', 'A product should have at least one variant for sizing.')
      return
    }
    setVariants(variants.filter((v) => v.id !== id))
  }

  const applyBulkPrice = () => {
    const p = Number(bulkPrice)
    if (!p || p <= 0) {
      toast('error', 'Enter a valid price')
      return
    }
    setVariants((prev) => prev.map((v) => ({ ...v, price: p })))
    setBulkPrice('')
    toast('success', `Updated all variant prices to ${formatCurrency(p)}`)
  }

  const applyBulkStock = () => {
    const s = Number(bulkStock)
    if (isNaN(s) || s < 0) {
      toast('error', 'Enter a valid stock number')
      return
    }
    setVariants((prev) => prev.map((v) => ({ ...v, stock: s })))
    setBulkStock('')
    toast('success', `Updated all variant stocks to ${s}`)
  }

  // ─── Wholesale Tiers ─────────────────────────────────────────

  const handleTierChange = (index: number, field: keyof WholesaleTier, value: any) => {
    const updated = [...tiers]
    updated[index] = { ...updated[index]!, [field]: value }
    setTiers(updated)
  }

  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1]
    const minQty = lastTier ? (lastTier.maxQty ? lastTier.maxQty + 1 : lastTier.minQty + 10) : 10
    setTiers([...tiers, { minQty, maxQty: null, price: Number(wholesalePrice) || 600 }])
  }

  const handleRemoveTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index))
  }

  // ─── Form Submission ─────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!name.trim()) errs.name = 'Product name is required'
    if (!basePrice || Number(basePrice) <= 0) errs.basePrice = 'Base price must be greater than 0'
    if (images.length === 0) errs.images = 'At least one image is required'

    // Check for duplicate variant combinations
    const seen = new Set<string>()
    for (const v of variants) {
      const key = `${v.size.toLowerCase()}_${v.color.toLowerCase()}`
      if (seen.has(key)) {
        errs.variants = `Duplicate variant detected for Size "${v.size}" and Color "${v.color}". Please remove the duplicate.`
        break
      }
      seen.add(key)
    }

    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      toast('error', Object.values(errs)[0] || 'Please fix the errors in the form.')
      return
    }

    const productId = existing?.id ?? `p-${Date.now()}`
    const slug =
      existing?.slug ??
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const finalVariants = variants.map((v) => ({
      ...v,
      productId,
      price: v.price && v.price > 0 ? Number(v.price) : Number(basePrice),
      stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
    }))

    const product: Product = {
      id: productId,
      name: name.trim(),
      slug,
      categoryId,
      description: description.trim(),
      careInstructions: careInstructions.trim(),
      materials: materials.trim(),
      price: Number(basePrice),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images,
      variants: finalVariants,
      status,
      wholesaleEnabled,
      wholesalePrice: wholesalePrice ? Number(wholesalePrice) : undefined,
      moq: moq ? Number(moq) : undefined,
      wholesaleTiers: wholesaleEnabled ? tiers : undefined,
      featured,
      bestseller,
      newArrival,
      rating: existing?.rating ?? 4.8,
      reviewCount: existing?.reviewCount ?? 12,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }

    upsertProduct(product)
    toast('success', isNew ? 'Product created successfully!' : 'Product changes saved successfully!')
    navigate(routes.adminProducts)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={isNew ? 'Create New Product' : `Edit: ${existing?.name}`}
        description="Configure product information, multiple photography, size-based variant pricing, and stock"
        backTo={routes.adminProducts}
        backLabel="Back to Products"
        actions={
          <div className="flex items-center gap-2">
            {!isNew && existing?.slug && (
              <a
                href={`/product/${existing.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary inline-flex items-center gap-1.5 text-xs py-2"
              >
                <Eye className="h-4 w-4" /> View on Storefront
              </a>
            )}
            <Button onClick={handleSubmit}>{isNew ? 'Publish Product' : 'Save Changes'}</Button>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <div className="flex border-b border-muted-border bg-white rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'details'
              ? 'border-brand text-brand font-semibold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          1. Basic Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'images'
              ? 'border-brand text-brand font-semibold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          2. Product Images ({images.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('variants')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'variants'
              ? 'border-brand text-brand font-semibold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          3. Variants & Size Pricing ({variants.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('wholesale')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'wholesale'
              ? 'border-brand text-brand font-semibold'
              : 'border-transparent text-charcoal-50 hover:text-charcoal'
          }`}
        >
          4. Wholesale & Visibility
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── TAB 1: BASIC DETAILS ─────────────────────────────────── */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="heading-serif text-lg font-semibold text-charcoal">General Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Product Name *"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Traditional Royal Tan Kolhapuri Chappal"
                  error={errors.name}
                />
                <Select
                  label="Category *"
                  name="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>

              <Textarea
                label="Product Description"
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the artisan craft, double sole stitch, patina, and ethnic character…"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Textarea
                  label="Materials Used"
                  name="materials"
                  rows={2}
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="e.g. 100% Vegetable-tanned buffalo leather upper; hand-stitched leather sole."
                />
                <Textarea
                  label="Care & Maintenance Instructions"
                  name="careInstructions"
                  rows={2}
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g. Wipe clean with a soft dry cloth. Apply coconut oil to soften leather."
                />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="heading-serif text-lg font-semibold text-charcoal">Base Retail Pricing</h2>
              <p className="text-xs text-muted">
                This acts as the default catalog price. You can customize exact prices per size in the Variants tab!
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Base Retail Price (₹) *"
                  name="basePrice"
                  type="number"
                  min={1}
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  error={errors.basePrice}
                  placeholder="e.g. 999"
                />
                <Input
                  label="Original MRP / Comparison Price (₹) (Optional)"
                  name="originalPrice"
                  type="number"
                  min={1}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 1299 for displaying discount"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: MULTIPLE PRODUCT IMAGES ────────────────────────── */}
        {activeTab === 'images' && (
          <div className="card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-muted-border pb-4">
              <div>
                <h2 className="heading-serif text-lg font-semibold text-charcoal">Product Photo Gallery</h2>
                <p className="text-xs text-muted">
                  The client requires multiple photos for every product. Mark one photo as primary, reorder, or upload
                  new photos.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPresetPicker(true)}
                  className="flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4 text-accent" /> Footwear Presets
                </Button>
                <label className="btn btn-primary text-xs py-2 cursor-pointer flex items-center gap-1.5">
                  <Upload className="h-4 w-4" /> Upload from Computer
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Direct URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste an image web URL (e.g. https://...)"
                className="input-base flex-1 text-sm"
              />
              <Button type="button" variant="secondary" onClick={handleAddImageUrl}>
                Add URL
              </Button>
            </div>

            {/* Images Grid */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((img, index) => {
                const isPrimary = index === 0
                return (
                  <div
                    key={index}
                    className={`relative group rounded-xl border-2 overflow-hidden transition-all bg-ivory-100 ${
                      isPrimary ? 'border-brand ring-2 ring-brand/20 shadow-md' : 'border-muted-border hover:border-brand-300'
                    }`}
                  >
                    <div className="aspect-square w-full overflow-hidden relative">
                      <img src={img} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                      {isPrimary && (
                        <div className="absolute top-2 left-2 bg-brand text-white text-3xs font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                          Main / Primary
                        </div>
                      )}
                      <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImage(img)}
                          className="p-2 rounded-full bg-white/90 text-charcoal hover:bg-white transition"
                          title="View High Res"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(index)}
                            className="p-2 rounded-full bg-white/90 text-brand hover:bg-white transition"
                            title="Set as Primary Image"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-white transition"
                          title="Remove Image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white border-t border-muted-border flex items-center justify-between text-xs">
                      <span className="text-muted font-medium">Photo #{index + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveImage(index, 'up')}
                          className="p-1 rounded text-muted hover:text-charcoal disabled:opacity-30"
                          title="Move left/up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === images.length - 1}
                          onClick={() => handleMoveImage(index, 'down')}
                          className="p-1 rounded text-muted hover:text-charcoal disabled:opacity-30"
                          title="Move right/down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {images.length === 0 && (
              <p className="text-center text-sm text-red-600 py-6">
                No images added yet. Please add at least one image.
              </p>
            )}
          </div>
        )}

        {/* ─── TAB 3: VARIANTS & SIZE-BASED PRICING ──────────────────── */}
        {activeTab === 'variants' && (
          <div className="space-y-6">
            {/* Quick Generator Box */}
            <div className="card p-6 bg-ivory-50 border-brand-200 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="heading-serif text-base font-semibold text-brand-700">
                    Variant & Size Matrix Generator
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Select the available sizes and colors to quickly generate the variant matrix. You can customize the
                    price of every size individually below.
                  </p>
                </div>
                <Button type="button" size="sm" onClick={generateCombinations}>
                  Generate Combinations
                </Button>
              </div>

              {/* Sizes Chips */}
              <div>
                <span className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1.5">
                  Available Sizes
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SIZES.map((s) => {
                    const active = selectedSizes.includes(s)
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() =>
                          setSelectedSizes((prev) =>
                            active ? prev.filter((x) => x !== s) : [...prev, s],
                          )
                        }
                        className={`h-8 min-w-8 px-2.5 rounded text-xs font-semibold border transition ${
                          active
                            ? 'bg-brand text-white border-brand'
                            : 'bg-white text-charcoal border-muted-border hover:border-brand'
                        }`}
                      >
                        Size {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Colors Chips */}
              <div>
                <span className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1.5">
                  Available Colors
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((col) => {
                    const active = selectedColors.includes(col)
                    return (
                      <button
                        type="button"
                        key={col}
                        onClick={() =>
                          setSelectedColors((prev) =>
                            active ? prev.filter((x) => x !== col) : [...prev, col],
                          )
                        }
                        className={`h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition ${
                          active
                            ? 'bg-brand-50 text-brand-700 border-brand font-semibold shadow-xs'
                            : 'bg-white text-charcoal border-muted-border hover:border-brand-300'
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-black/20"
                          style={{ backgroundColor: colorSwatch(col) }}
                        />
                        {col}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bulk Adjustments Bar */}
            <div className="card p-4 flex flex-wrap items-center justify-between gap-4 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted">Bulk Actions:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    placeholder="Price (₹)"
                    className="input-base w-24 text-xs py-1.5"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={applyBulkPrice}>
                    Set All Prices
                  </Button>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <input
                    type="number"
                    value={bulkStock}
                    onChange={(e) => setBulkStock(e.target.value)}
                    placeholder="Stock Qty"
                    className="input-base w-24 text-xs py-1.5"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={applyBulkStock}>
                    Set All Stock
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="Custom Size"
                  className="input-base w-28 text-xs py-1.5"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="Custom Color"
                  className="input-base w-28 text-xs py-1.5"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddSingleVariant}>
                  <Plus className="h-3.5 w-3.5" /> Add Single
                </Button>
              </div>
            </div>

            {/* Variants Table */}
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-muted-border flex items-center justify-between">
                <div>
                  <h3 className="heading-serif text-base font-semibold text-charcoal">
                    Configured Variants ({variants.length})
                  </h3>
                  <p className="text-xs text-muted">
                    Configure individual retail prices by size (e.g. Size 6: ₹899, Size 7: ₹949, Size 8: ₹999).
                  </p>
                </div>
                {errors.variants && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.variants}
                  </p>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted-bg border-b border-muted-border text-xs text-muted font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left">Size</th>
                      <th className="px-4 py-3 text-left">Color</th>
                      <th className="px-4 py-3 text-left">SKU</th>
                      <th className="px-4 py-3 text-left">Retail Price (₹) *</th>
                      <th className="px-4 py-3 text-left">Stock Qty *</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted-border">
                    {variants.map((v) => (
                      <tr key={v.id} className="hover:bg-muted-bg/40">
                        <td className="px-4 py-2 font-bold text-charcoal">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-ivory-200 border border-muted-border">
                            {v.size}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-4 w-4 rounded-full border border-black/20"
                              style={{ backgroundColor: colorSwatch(v.color) }}
                            />
                            <span>{v.color}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleUpdateVariant(v.id, { sku: e.target.value })}
                            className="input-base text-xs py-1 px-2 font-mono w-36"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative w-32">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">₹</span>
                            <input
                              type="number"
                              min={1}
                              value={v.price ?? basePrice}
                              onChange={(e) =>
                                handleUpdateVariant(v.id, { price: Number(e.target.value) })
                              }
                              className="input-base text-xs py-1 pl-6 pr-2 font-medium w-full"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={0}
                            value={v.stock}
                            onChange={(e) =>
                              handleUpdateVariant(v.id, { stock: Math.max(0, Number(e.target.value)) })
                            }
                            className="input-base text-xs py-1 px-2 w-20"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateVariant(v.id, { active: v.active === false ? true : false })}
                            className={`px-2 py-0.5 rounded text-3xs font-bold uppercase transition ${
                              v.active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {v.active !== false ? 'Available' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(v.id)}
                            className="p-1 rounded text-muted hover:text-red-600 transition"
                            title="Remove Variant"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {variants.length === 0 && (
                <div className="p-8 text-center text-sm text-muted">
                  No variants configured. Click "Generate Combinations" above to create sizing options.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: WHOLESALE & VISIBILITY ─────────────────────────── */}
        {activeTab === 'wholesale' && (
          <div className="space-y-6">
            {/* Wholesale Settings */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-muted-border pb-3">
                <div>
                  <h2 className="heading-serif text-lg font-semibold text-charcoal">Wholesale Settings</h2>
                  <p className="text-xs text-muted">Configure B2B bulk pricing and minimum order quantities</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                  <input
                    type="checkbox"
                    checked={wholesaleEnabled}
                    onChange={(e) => setWholesaleEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-muted-border text-brand focus:ring-brand"
                  />
                  Enable for Wholesale Buyers
                </label>
              </div>

              {wholesaleEnabled && (
                <div className="space-y-4 pt-2">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Base Wholesale Price (₹)"
                      name="wholesalePrice"
                      type="number"
                      min={1}
                      value={wholesalePrice}
                      onChange={(e) => setWholesalePrice(e.target.value)}
                      placeholder="e.g. 550"
                    />
                    <Input
                      label="Minimum Order Quantity (MOQ)"
                      name="moq"
                      type="number"
                      min={1}
                      value={moq}
                      onChange={(e) => setMoq(e.target.value)}
                      placeholder="e.g. 6 pairs"
                    />
                  </div>

                  {/* Quantity Tiers */}
                  <div className="border border-muted-border rounded-xl p-4 bg-ivory-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                        Volume Pricing Tiers
                      </span>
                      <Button type="button" size="sm" variant="ghost" onClick={handleAddTier}>
                        <Plus className="h-3.5 w-3.5" /> Add Tier
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {tiers.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-muted-border text-xs">
                          <span className="w-16 font-medium">Tier {idx + 1}:</span>
                          <div className="flex items-center gap-1.5 flex-1">
                            <span>Min:</span>
                            <input
                              type="number"
                              min={1}
                              value={t.minQty}
                              onChange={(e) => handleTierChange(idx, 'minQty', Number(e.target.value))}
                              className="input-base w-20 py-1 px-2 text-xs"
                            />
                            <span className="ml-2">Max:</span>
                            <input
                              type="number"
                              value={t.maxQty ?? ''}
                              placeholder="No limit"
                              onChange={(e) =>
                                handleTierChange(
                                  idx,
                                  'maxQty',
                                  e.target.value ? Number(e.target.value) : null,
                                )
                              }
                              className="input-base w-24 py-1 px-2 text-xs"
                            />
                            <span className="ml-2">Price: ₹</span>
                            <input
                              type="number"
                              min={1}
                              value={t.price}
                              onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                              className="input-base w-24 py-1 px-2 text-xs font-semibold"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTier(idx)}
                            className="p-1 text-muted hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Merchandising & Visibility */}
            <div className="card p-6 space-y-4">
              <h2 className="heading-serif text-lg font-semibold text-charcoal">Catalogue Visibility & Badges</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Publish Status *"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
                >
                  <option value="active">Active (Visible in Storefront & Search)</option>
                  <option value="draft">Draft (Hidden from customers)</option>
                </Select>
              </div>

              <div className="pt-2 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-muted-border text-brand focus:ring-brand"
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={(e) => setBestseller(e.target.checked)}
                    className="h-4 w-4 rounded border-muted-border text-brand focus:ring-brand"
                  />
                  <span>Bestseller Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={newArrival}
                    onChange={(e) => setNewArrival(e.target.checked)}
                    className="h-4 w-4 rounded border-muted-border text-brand focus:ring-brand"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-muted-border pt-4 bg-white p-4 rounded-xl">
          <Link to={routes.adminProducts}>
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {activeTab !== 'wholesale' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (activeTab === 'details') setActiveTab('images')
                  else if (activeTab === 'images') setActiveTab('variants')
                  else if (activeTab === 'variants') setActiveTab('wholesale')
                }}
              >
                Next Section →
              </Button>
            )}
            <Button type="submit">{isNew ? 'Create Product' : 'Save All Changes'}</Button>
          </div>
        </div>
      </form>

      {/* Preset Picker Dialog */}
      <Dialog
        open={showPresetPicker}
        onClose={() => setShowPresetPicker(false)}
        title="Select from Footwear Photo Presets"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted">
            Click any authentic photo preset below to immediately add it to your product's photography gallery.
          </p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-h-[60vh] overflow-y-auto p-1">
            {footwearImagePresets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  setImages((prev) => [...prev, preset.url])
                  toast('success', `Added "${preset.title}"`)
                  setShowPresetPicker(false)
                }}
                className="group cursor-pointer rounded-lg border border-muted-border hover:border-brand overflow-hidden transition-all bg-ivory-100"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs font-semibold text-charcoal truncate">{preset.title}</p>
                  <span className="text-3xs text-muted">{preset.category} · {preset.color}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={() => setShowPresetPicker(false)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>

      {/* High-res Image Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        title="Image Preview"
        size="lg"
      >
        {previewImage && (
          <div className="space-y-4">
            <div className="max-h-[70vh] overflow-hidden rounded-xl bg-ivory-100 flex items-center justify-center">
              <img src={previewImage} alt="Preview" className="max-h-[65vh] w-auto object-contain rounded-lg" />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setPreviewImage(null)}>Close</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
