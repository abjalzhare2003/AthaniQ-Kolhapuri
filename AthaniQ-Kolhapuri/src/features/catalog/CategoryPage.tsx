import { useParams, Navigate } from 'react-router-dom'
import { getCategoryBySlug } from '@/data/categories'
import { ShopPage } from '@/features/catalog/ShopPage'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = slug ? getCategoryBySlug(slug) : undefined
  if (!category) return <Navigate to="/shop" replace />
  // key resets filter state when navigating between categories
  return <ShopPage key={category.slug} lockedCategory={category.slug} />
}
