import type { Product } from '@/types'
import { productImages } from '@/utils/placeholder'

/**
 * Sample product catalogue for demo purposes.
 * NOTE: These are representative placeholder products.
 * Actual product names, prices, SKUs, and descriptions
 * must be provided and verified by the client before production launch.
 */

function variant(productId: string, size: string, color: string, sku: string, stock: number) {
  return { id: `${sku}-v`, productId, size, color, sku, stock }
}

export const products: Product[] = [
  // ─── MEN ───────────────────────────────────────────────
  {
    id: 'p-men-001',
    name: 'Classic Tan Kolhapuri Chappal',
    slug: 'classic-tan-kolhapuri-chappal-men',
    categoryId: 'cat-men',
    description:
      'The quintessential Kolhapuri chappal, hand-stitched by master artisans in Kolhapur. Supple vegetable-tanned leather with traditional double-strap design. Improves with wear — develops a rich patina unique to the wearer.',
    careInstructions:
      'Wipe with a slightly damp cloth. Apply leather conditioner every 2–3 months. Store away from direct sunlight.',
    materials: 'Vegetable-tanned buffalo leather upper; hand-stitched leather sole.',
    price: 1499,
    images: productImages('Classic Tan Kolhapuri Chappal', 1),
    variants: [
      variant('p-men-001', '6', 'Tan', 'AK-M-CTK-6', 12),
      variant('p-men-001', '7', 'Tan', 'AK-M-CTK-7', 18),
      variant('p-men-001', '8', 'Tan', 'AK-M-CTK-8', 22),
      variant('p-men-001', '9', 'Tan', 'AK-M-CTK-9', 15),
      variant('p-men-001', '10', 'Tan', 'AK-M-CTK-10', 8),
      variant('p-men-001', '11', 'Tan', 'AK-M-CTK-11', 4),
      variant('p-men-001', '6', 'Dark Brown', 'AK-M-CTK-DB-6', 9),
      variant('p-men-001', '7', 'Dark Brown', 'AK-M-CTK-DB-7', 14),
      variant('p-men-001', '8', 'Dark Brown', 'AK-M-CTK-DB-8', 20),
      variant('p-men-001', '9', 'Dark Brown', 'AK-M-CTK-DB-9', 11),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 750,
    moq: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 23, price: 750 },
      { minQty: 24, maxQty: 47, price: 690 },
      { minQty: 48, maxQty: null, price: 620 },
    ],
    sizeGuide: 'Indian sizing. Runs true to size.',
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.7,
    reviewCount: 148,
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'p-men-002',
    name: 'Embroidered Premium Men\'s Kolhapuri',
    slug: 'embroidered-premium-mens-kolhapuri',
    categoryId: 'cat-men',
    description:
      'A statement piece featuring intricate floral embroidery on a rich dark-brown base. Double-layered leather sole for durability. Perfect for festive occasions and formal ethnic wear.',
    careInstructions: 'Wipe clean with a soft cloth. Avoid prolonged exposure to water.',
    materials: 'Full-grain leather with hand embroidery; layered leather sole.',
    price: 2299,
    originalPrice: 2699,
    images: productImages('Embroidered Premium Kolhapuri', 5),
    variants: [
      variant('p-men-002', '6', 'Dark Brown', 'AK-M-EPK-6', 6),
      variant('p-men-002', '7', 'Dark Brown', 'AK-M-EPK-7', 10),
      variant('p-men-002', '8', 'Dark Brown', 'AK-M-EPK-8', 14),
      variant('p-men-002', '9', 'Dark Brown', 'AK-M-EPK-9', 9),
      variant('p-men-002', '10', 'Dark Brown', 'AK-M-EPK-10', 5),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 1150,
    moq: 6,
    wholesaleTiers: [
      { minQty: 6, maxQty: 11, price: 1150 },
      { minQty: 12, maxQty: 23, price: 1050 },
      { minQty: 24, maxQty: null, price: 950 },
    ],
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 62,
    createdAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'p-men-003',
    name: 'Block Print Men\'s Chappal',
    slug: 'block-print-mens-chappal',
    categoryId: 'cat-men',
    description:
      'Casual everyday Kolhapuri with hand block-printed strap detailing. Lightweight and comfortable for all-day wear.',
    careInstructions: 'Clean with a damp cloth. Air dry naturally.',
    materials: 'Cowhide leather; rubber-reinforced sole.',
    price: 1199,
    images: productImages('Block Print Mens Chappal', 9),
    variants: [
      variant('p-men-003', '6', 'Camel', 'AK-M-BPM-C-6', 20),
      variant('p-men-003', '7', 'Camel', 'AK-M-BPM-C-7', 25),
      variant('p-men-003', '8', 'Camel', 'AK-M-BPM-C-8', 30),
      variant('p-men-003', '9', 'Camel', 'AK-M-BPM-C-9', 18),
      variant('p-men-003', '10', 'Camel', 'AK-M-BPM-C-10', 12),
      variant('p-men-003', '6', 'Black', 'AK-M-BPM-BK-6', 15),
      variant('p-men-003', '7', 'Black', 'AK-M-BPM-BK-7', 18),
      variant('p-men-003', '8', 'Black', 'AK-M-BPM-BK-8', 22),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 599,
    moq: 24,
    wholesaleTiers: [
      { minQty: 24, maxQty: 47, price: 599 },
      { minQty: 48, maxQty: 95, price: 549 },
      { minQty: 96, maxQty: null, price: 499 },
    ],
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.3,
    reviewCount: 201,
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'p-men-004',
    name: 'Artisan Double Strap Sandal',
    slug: 'artisan-double-strap-sandal-men',
    categoryId: 'cat-men',
    description:
      'Wide-fit double strap sandal with adjustable brass buckles. Ergonomic footbed contoured for comfort. A versatile everyday companion.',
    careInstructions: 'Polish with leather cream to maintain sheen.',
    materials: 'Milled leather; carved wooden heel; brass hardware.',
    price: 1799,
    images: productImages('Artisan Double Strap Sandal', 13),
    variants: [
      variant('p-men-004', '7', 'Cognac', 'AK-M-ADS-CG-7', 8),
      variant('p-men-004', '8', 'Cognac', 'AK-M-ADS-CG-8', 14),
      variant('p-men-004', '9', 'Cognac', 'AK-M-ADS-CG-9', 10),
      variant('p-men-004', '10', 'Cognac', 'AK-M-ADS-CG-10', 6),
      variant('p-men-004', '11', 'Cognac', 'AK-M-ADS-CG-11', 3),
    ],
    status: 'active',
    wholesaleEnabled: false,
    featured: false,
    bestseller: false,
    newArrival: true,
    rating: 4.4,
    reviewCount: 38,
    createdAt: '2025-10-01T00:00:00Z',
  },
  // ─── WOMEN ─────────────────────────────────────────────
  {
    id: 'p-women-001',
    name: 'Peacock Embossed Women\'s Kolhapuri',
    slug: 'peacock-embossed-womens-kolhapuri',
    categoryId: 'cat-women',
    description:
      'Inspired by the majestic peacock, each pair features a delicate hand-embossed feather motif on soft nappa leather. Perfect for ethnic dresses, sarees, and kurtas.',
    careInstructions: 'Wipe with a soft cloth. Use a specialist leather cleaner for stubborn marks.',
    materials: 'Nappa leather; embossed finish; padded insole; leather outsole.',
    price: 1899,
    images: productImages('Peacock Embossed Womens Kolhapuri', 17),
    variants: [
      variant('p-women-001', '3', 'Rose Gold', 'AK-W-PEK-RG-3', 10),
      variant('p-women-001', '4', 'Rose Gold', 'AK-W-PEK-RG-4', 16),
      variant('p-women-001', '5', 'Rose Gold', 'AK-W-PEK-RG-5', 22),
      variant('p-women-001', '6', 'Rose Gold', 'AK-W-PEK-RG-6', 18),
      variant('p-women-001', '7', 'Rose Gold', 'AK-W-PEK-RG-7', 12),
      variant('p-women-001', '3', 'Ivory', 'AK-W-PEK-IV-3', 8),
      variant('p-women-001', '4', 'Ivory', 'AK-W-PEK-IV-4', 12),
      variant('p-women-001', '5', 'Ivory', 'AK-W-PEK-IV-5', 15),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 950,
    moq: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 23, price: 950 },
      { minQty: 24, maxQty: 47, price: 875 },
      { minQty: 48, maxQty: null, price: 799 },
    ],
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 224,
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'p-women-002',
    name: 'Mirror Work Festive Sandal',
    slug: 'mirror-work-festive-sandal-women',
    categoryId: 'cat-women',
    description:
      'Gleaming mirror-work embellishments adorning a plush leather base. Designed for weddings, celebrations, and festive occasions where you want your footwear to make a statement.',
    careInstructions: 'Handle mirror work with care. Store in the provided dust bag.',
    materials: 'Premium leather; hand-set mirror tiles; padded footbed.',
    price: 2799,
    originalPrice: 3299,
    images: productImages('Mirror Work Festive Sandal', 21),
    variants: [
      variant('p-women-002', '3', 'Gold', 'AK-W-MWF-GD-3', 4),
      variant('p-women-002', '4', 'Gold', 'AK-W-MWF-GD-4', 7),
      variant('p-women-002', '5', 'Gold', 'AK-W-MWF-GD-5', 9),
      variant('p-women-002', '6', 'Gold', 'AK-W-MWF-GD-6', 8),
      variant('p-women-002', '7', 'Gold', 'AK-W-MWF-GD-7', 5),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 1399,
    moq: 6,
    wholesaleTiers: [
      { minQty: 6, maxQty: 11, price: 1399 },
      { minQty: 12, maxQty: null, price: 1249 },
    ],
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 87,
    createdAt: '2025-09-15T00:00:00Z',
  },
  {
    id: 'p-women-003',
    name: 'Everyday Comfort Kolhapuri',
    slug: 'everyday-comfort-kolhapuri-women',
    categoryId: 'cat-women',
    description:
      'Lightweight, cushioned Kolhapuri for daily wear. Soft leather strap with extra padding on the insole for all-day comfort. Available in three elegant earth tones.',
    careInstructions: 'Clean with a damp cloth. Air dry away from heat.',
    materials: 'Soft milled leather; cushioned insole; non-slip rubber sole.',
    price: 1299,
    images: productImages('Everyday Comfort Kolhapuri Women', 25),
    variants: [
      variant('p-women-003', '3', 'Tan', 'AK-W-ECK-T-3', 20),
      variant('p-women-003', '4', 'Tan', 'AK-W-ECK-T-4', 24),
      variant('p-women-003', '5', 'Tan', 'AK-W-ECK-T-5', 30),
      variant('p-women-003', '6', 'Tan', 'AK-W-ECK-T-6', 25),
      variant('p-women-003', '7', 'Tan', 'AK-W-ECK-T-7', 18),
      variant('p-women-003', '3', 'Black', 'AK-W-ECK-BK-3', 16),
      variant('p-women-003', '4', 'Black', 'AK-W-ECK-BK-4', 20),
      variant('p-women-003', '5', 'Black', 'AK-W-ECK-BK-5', 22),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 649,
    moq: 24,
    wholesaleTiers: [
      { minQty: 24, maxQty: 47, price: 649 },
      { minQty: 48, maxQty: null, price: 589 },
    ],
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.5,
    reviewCount: 312,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'p-women-004',
    name: 'Kantha Stitch T-Strap',
    slug: 'kantha-stitch-t-strap-women',
    categoryId: 'cat-women',
    description:
      'A fusion of Kolhapuri craft and Bengal\'s Kantha embroidery tradition. Multicolour thread work on a nude leather base. Limited artisan run.',
    careInstructions: 'Spot clean only. Store flat. Avoid moisture.',
    materials: 'Chrome-tanned leather; cotton Kantha embroidery; leather sole.',
    price: 2199,
    images: productImages('Kantha Stitch T-Strap', 29),
    variants: [
      variant('p-women-004', '3', 'Nude', 'AK-W-KTS-ND-3', 3),
      variant('p-women-004', '4', 'Nude', 'AK-W-KTS-ND-4', 5),
      variant('p-women-004', '5', 'Nude', 'AK-W-KTS-ND-5', 7),
      variant('p-women-004', '6', 'Nude', 'AK-W-KTS-ND-6', 6),
    ],
    status: 'active',
    wholesaleEnabled: false,
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.9,
    reviewCount: 43,
    createdAt: '2025-10-10T00:00:00Z',
  },
  // ─── KIDS ──────────────────────────────────────────────
  {
    id: 'p-kids-001',
    name: 'Little Steps Classic Chappal',
    slug: 'little-steps-classic-chappal-kids',
    categoryId: 'cat-kids',
    description:
      "Soft, flexible Kolhapuri for kids' first steps. Adjustable velcro strap for easy fitting. Extra cushioned insole for all-day play.",
    careInstructions: 'Wipe with a clean cloth. Air dry naturally.',
    materials: 'Soft buffed leather; cushioned insole; velcro strap.',
    price: 699,
    images: productImages('Little Steps Kids Classic Chappal', 33),
    variants: [
      variant('p-kids-001', '1', 'Tan', 'AK-K-LS-T-1', 20),
      variant('p-kids-001', '2', 'Tan', 'AK-K-LS-T-2', 25),
      variant('p-kids-001', '3', 'Tan', 'AK-K-LS-T-3', 22),
      variant('p-kids-001', '4', 'Tan', 'AK-K-LS-T-4', 18),
      variant('p-kids-001', '1', 'Pink', 'AK-K-LS-PK-1', 15),
      variant('p-kids-001', '2', 'Pink', 'AK-K-LS-PK-2', 18),
      variant('p-kids-001', '3', 'Pink', 'AK-K-LS-PK-3', 14),
      variant('p-kids-001', '4', 'Pink', 'AK-K-LS-PK-4', 10),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 349,
    moq: 24,
    wholesaleTiers: [
      { minQty: 24, maxQty: 47, price: 349 },
      { minQty: 48, maxQty: null, price: 299 },
    ],
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.6,
    reviewCount: 156,
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    id: 'p-kids-002',
    name: 'Butterfly Embossed Girls\' Sandal',
    slug: 'butterfly-embossed-girls-sandal',
    categoryId: 'cat-kids',
    description:
      'Charming butterfly motif on a pastel pink leather sandal. Two-strap open design with buckle closure for a comfortable fit.',
    careInstructions: 'Clean with a soft damp cloth.',
    materials: 'Buffed leather; painted butterfly emboss; soft footbed.',
    price: 849,
    images: productImages('Butterfly Embossed Girls Sandal', 37),
    variants: [
      variant('p-kids-002', '1', 'Pink', 'AK-K-BEG-PK-1', 12),
      variant('p-kids-002', '2', 'Pink', 'AK-K-BEG-PK-2', 16),
      variant('p-kids-002', '3', 'Pink', 'AK-K-BEG-PK-3', 14),
      variant('p-kids-002', '4', 'Pink', 'AK-K-BEG-PK-4', 9),
    ],
    status: 'active',
    wholesaleEnabled: false,
    featured: false,
    bestseller: false,
    newArrival: true,
    rating: 4.4,
    reviewCount: 72,
    createdAt: '2025-09-20T00:00:00Z',
  },
  {
    id: 'p-kids-003',
    name: 'Dino Print Boys\' Chappal',
    slug: 'dino-print-boys-chappal',
    categoryId: 'cat-kids',
    description:
      'Fun dinosaur print strap on a sturdy Kolhapuri base. Kids love them, parents trust the quality. Non-slip sole for active play.',
    careInstructions: 'Wipe clean. Air dry naturally.',
    materials: 'Printed leather; non-slip sole; cushioned insole.',
    price: 749,
    images: productImages('Dino Print Boys Chappal', 41),
    variants: [
      variant('p-kids-003', '1', 'Olive', 'AK-K-DPB-OL-1', 18),
      variant('p-kids-003', '2', 'Olive', 'AK-K-DPB-OL-2', 22),
      variant('p-kids-003', '3', 'Olive', 'AK-K-DPB-OL-3', 20),
      variant('p-kids-003', '4', 'Olive', 'AK-K-DPB-OL-4', 15),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 374,
    moq: 24,
    wholesaleTiers: [
      { minQty: 24, maxQty: 47, price: 374 },
      { minQty: 48, maxQty: null, price: 329 },
    ],
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.5,
    reviewCount: 93,
    createdAt: '2025-03-15T00:00:00Z',
  },
  // ─── ACCESSORIES ───────────────────────────────────────
  {
    id: 'p-acc-001',
    name: 'Braided Leather Belt',
    slug: 'braided-leather-belt',
    categoryId: 'cat-accessories',
    description:
      'Hand-braided full-grain leather belt with a brushed brass buckle. Adds a heritage touch to both casual and formal attire.',
    careInstructions: 'Wipe with a dry cloth. Apply leather conditioner for longevity.',
    materials: 'Full-grain cowhide leather; brushed brass buckle.',
    price: 999,
    images: productImages('Braided Leather Belt', 45),
    variants: [
      variant('p-acc-001', '28', 'Tan', 'AK-A-BLB-T-28', 14),
      variant('p-acc-001', '30', 'Tan', 'AK-A-BLB-T-30', 18),
      variant('p-acc-001', '32', 'Tan', 'AK-A-BLB-T-32', 22),
      variant('p-acc-001', '34', 'Tan', 'AK-A-BLB-T-34', 16),
      variant('p-acc-001', '36', 'Tan', 'AK-A-BLB-T-36', 10),
      variant('p-acc-001', '28', 'Dark Brown', 'AK-A-BLB-DB-28', 10),
      variant('p-acc-001', '32', 'Dark Brown', 'AK-A-BLB-DB-32', 15),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 499,
    moq: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 23, price: 499 },
      { minQty: 24, maxQty: null, price: 449 },
    ],
    featured: false,
    bestseller: true,
    newArrival: false,
    rating: 4.6,
    reviewCount: 118,
    createdAt: '2025-02-20T00:00:00Z',
  },
  {
    id: 'p-acc-002',
    name: 'Kolhapuri Leather Wallet',
    slug: 'kolhapuri-leather-wallet',
    categoryId: 'cat-accessories',
    description:
      'Slim bifold wallet crafted from the same premium leather as our footwear. Two card slots, a bill compartment, and a traditional embossed Kolhapuri motif on the front.',
    careInstructions: 'Keep away from moisture. Polish with a soft cloth.',
    materials: 'Full-grain cowhide leather; embossed finish.',
    price: 799,
    images: productImages('Kolhapuri Leather Wallet', 49),
    variants: [
      variant('p-acc-002', 'One Size', 'Tan', 'AK-A-KLW-T', 30),
      variant('p-acc-002', 'One Size', 'Dark Brown', 'AK-A-KLW-DB', 25),
      variant('p-acc-002', 'One Size', 'Black', 'AK-A-KLW-BK', 20),
    ],
    status: 'active',
    wholesaleEnabled: true,
    wholesalePrice: 399,
    moq: 12,
    wholesaleTiers: [
      { minQty: 12, maxQty: 23, price: 399 },
      { minQty: 24, maxQty: null, price: 359 },
    ],
    featured: true,
    bestseller: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 65,
    createdAt: '2025-09-25T00:00:00Z',
  },
  {
    id: 'p-acc-003',
    name: 'Leather Care Kit',
    slug: 'leather-care-kit',
    categoryId: 'cat-accessories',
    description:
      'Keep your Kolhapuri footwear in pristine condition. Kit includes: premium leather conditioner (100ml), horsehair buffing brush, and microfibre cloth.',
    careInstructions: 'Follow instructions on each product. Store at room temperature.',
    materials: 'Natural beeswax conditioner; horsehair brush; microfibre cloth.',
    price: 449,
    images: productImages('Leather Care Kit', 53),
    variants: [
      variant('p-acc-003', 'Kit', 'Natural', 'AK-A-LCK', 45),
    ],
    status: 'active',
    wholesaleEnabled: false,
    featured: false,
    bestseller: false,
    newArrival: false,
    rating: 4.8,
    reviewCount: 42,
    createdAt: '2025-04-01T00:00:00Z',
  },
]

// ─── Helpers ────────────────────────────────────────────────

let productsProvider: (() => Product[]) | null = null

export function setProductsProvider(provider: () => Product[]) {
  productsProvider = provider
}

function getLiveProducts(): Product[] {
  return productsProvider ? productsProvider() : products
}

export function getProductBySlug(slug: string): Product | undefined {
  return getLiveProducts().find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return getLiveProducts().find((p) => p.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getLiveProducts().filter((p) => p.categoryId === categoryId && p.status === 'active')
}

export function getFeaturedProducts(): Product[] {
  return getLiveProducts().filter((p) => p.featured && p.status === 'active')
}

export function getBestsellers(): Product[] {
  return getLiveProducts().filter((p) => p.bestseller && p.status === 'active')
}

export function getNewArrivals(): Product[] {
  return getLiveProducts().filter((p) => p.newArrival && p.status === 'active')
}

export function getWholesaleProducts(): Product[] {
  return getLiveProducts().filter((p) => p.wholesaleEnabled && p.status === 'active')
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getLiveProducts()
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.status === 'active')
    .slice(0, limit)
}

/** Returns all distinct colors for a product. */
export function getProductColors(product: Product): string[] {
  return [...new Set(product.variants.map((v) => v.color))]
}

/** Returns all distinct sizes for a product (optionally filtered by color). */
export function getProductSizes(product: Product, color?: string): string[] {
  const variants = color ? product.variants.filter((v) => v.color === color) : product.variants
  return [...new Set(variants.map((v) => v.size))]
}

/** Get a specific variant. */
export function getVariant(product: Product, size: string, color: string): Product['variants'][0] | undefined {
  return product.variants.find((v) => v.size === size && v.color === color)
}

/** Get total stock across all variants. */
export function getTotalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0)
}
