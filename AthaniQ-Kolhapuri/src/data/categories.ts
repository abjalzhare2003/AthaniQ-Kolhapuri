import type { Category } from '@/types'
import { categoryImage } from '@/utils/placeholder'

export const categories: Category[] = [
  {
    id: 'cat-men',
    name: 'Men',
    slug: 'men',
    description: 'Handcrafted Kolhapuri chappals and leather footwear for men, blending traditional craftsmanship with contemporary comfort.',
    image: categoryImage('Men', 10),
    active: true,
  },
  {
    id: 'cat-women',
    name: 'Women',
    slug: 'women',
    description: 'Elegant Kolhapuri sandals and designer leather footwear for women, crafted with premium materials and intricate detailing.',
    image: categoryImage('Women', 20),
    active: true,
  },
  {
    id: 'cat-kids',
    name: 'Kids',
    slug: 'kids',
    description: 'Durable and comfortable Kolhapuri footwear for children, made with the same craftsmanship as our adult collection.',
    image: categoryImage('Kids', 30),
    active: true,
  },
  {
    id: 'cat-accessories',
    name: 'Leather Accessories',
    slug: 'accessories',
    description: 'Premium leather accessories including belts, wallets, and care products to complement your Kolhapuri footwear.',
    image: categoryImage('Leather Accessories', 40),
    active: true,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
