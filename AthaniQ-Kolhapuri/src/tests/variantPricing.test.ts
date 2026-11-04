import { describe, it, expect } from 'vitest'
import { getProductColors, getProductSizes, getVariant, getTotalStock } from '@/data/products'
import type { Product } from '@/types'

describe('Size-Based Pricing and Product Variants', () => {
  const sampleProduct: Product = {
    id: 'p-kolhapuri-chappal',
    name: 'Traditional Kolhapuri Chappal',
    slug: 'traditional-kolhapuri-chappal',
    categoryId: 'cat-men',
    description: 'Master artisan crafted',
    careInstructions: 'Wipe with cloth',
    materials: 'Buffalo leather',
    price: 949, // Base price
    images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1'],
    variants: [
      {
        id: 'var-6-tan',
        productId: 'p-kolhapuri-chappal',
        size: '6',
        color: 'Tan',
        sku: 'AK-TRAD-6-TAN',
        price: 899, // Specific price for Size 6 Tan
        stock: 12,
        active: true,
      },
      {
        id: 'var-7-tan',
        productId: 'p-kolhapuri-chappal',
        size: '7',
        color: 'Tan',
        sku: 'AK-TRAD-7-TAN',
        price: 949, // Specific price for Size 7 Tan
        stock: 8,
        active: true,
      },
      {
        id: 'var-8-tan',
        productId: 'p-kolhapuri-chappal',
        size: '8',
        color: 'Tan',
        sku: 'AK-TRAD-8-TAN',
        price: 999, // Specific price for Size 8 Tan
        stock: 5,
        active: true,
      },
      {
        id: 'var-7-black',
        productId: 'p-kolhapuri-chappal',
        size: '7',
        color: 'Black',
        sku: 'AK-TRAD-7-BLK',
        price: 949, // Specific price for Size 7 Black
        stock: 10,
        active: true,
      },
    ],
    status: 'active',
    wholesaleEnabled: true,
    featured: true,
    bestseller: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 45,
    createdAt: new Date().toISOString(),
  }

  it('correctly returns different prices depending on size as required by client', () => {
    const v6 = getVariant(sampleProduct, '6', 'Tan')
    const v7 = getVariant(sampleProduct, '7', 'Tan')
    const v8 = getVariant(sampleProduct, '8', 'Tan')

    expect(v6?.price).toBe(899)
    expect(v7?.price).toBe(949)
    expect(v8?.price).toBe(999)

    // Verify sizes do not assume identical pricing
    expect(v6?.price).not.toBe(v8?.price)
  })

  it('correctly models combinations of size and color as distinct variants', () => {
    const v7Tan = getVariant(sampleProduct, '7', 'Tan')
    const v7Black = getVariant(sampleProduct, '7', 'Black')

    expect(v7Tan).toBeDefined()
    expect(v7Black).toBeDefined()
    expect(v7Tan?.sku).toBe('AK-TRAD-7-TAN')
    expect(v7Black?.sku).toBe('AK-TRAD-7-BLK')
    expect(v7Tan?.stock).toBe(8)
    expect(v7Black?.stock).toBe(10)
  })

  it('extracts distinct colors for catalog filtering', () => {
    const colors = getProductColors(sampleProduct)
    expect(colors).toEqual(['Tan', 'Black'])
  })

  it('extracts distinct sizes', () => {
    const sizes = getProductSizes(sampleProduct)
    expect(sizes).toEqual(['6', '7', '8'])
  })

  it('computes total inventory stock accurately across all variants', () => {
    const total = getTotalStock(sampleProduct)
    // 12 + 8 + 5 + 10 = 35
    expect(total).toBe(35)
  })
})
