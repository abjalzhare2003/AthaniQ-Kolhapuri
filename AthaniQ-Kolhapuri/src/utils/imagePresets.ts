/**
 * High quality curated footwear image presets for AthaniQ Kolhapuri.
 * Used by the Admin Multiple Image Manager for quick preview, mock uploads,
 * and realistic demonstration.
 */

export interface ImagePreset {
  id: string
  title: string
  category: 'Men' | 'Women' | 'Kids' | 'Accessories'
  url: string
  color: string
}

export const footwearImagePresets: ImagePreset[] = [
  {
    id: 'img-p1',
    title: 'Classic Tan Leather Chappal',
    category: 'Men',
    url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
    color: 'Tan',
  },
  {
    id: 'img-p2',
    title: 'Dark Brown Embroidered Kolhapuri',
    category: 'Men',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    color: 'Dark Brown',
  },
  {
    id: 'img-p3',
    title: 'Handcrafted Honey Tan Double Sole',
    category: 'Men',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    color: 'Honey Tan',
  },
  {
    id: 'img-p4',
    title: 'Royal Black Polished Kolhapuri',
    category: 'Men',
    url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    color: 'Black',
  },
  {
    id: 'img-p5',
    title: "Women's Golden Braided Festive Footwear",
    category: 'Women',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    color: 'Gold',
  },
  {
    id: 'img-p6',
    title: "Tasseled Maroon Festive Kolhapuri",
    category: 'Women',
    url: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80',
    color: 'Maroon',
  },
  {
    id: 'img-p7',
    title: "Natural Raw Leather Kolhapuri",
    category: 'Men',
    url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    color: 'Natural',
  },
  {
    id: 'img-p8',
    title: "Handcrafted Kids Ethnic Sandal",
    category: 'Kids',
    url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',
    color: 'Tan',
  },
  {
    id: 'img-p9',
    title: "Pure Leather Bifold Wallet",
    category: 'Accessories',
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    color: 'Tan',
  },
  {
    id: 'img-p10',
    title: "Artisan Leather Belt with Brass Buckle",
    category: 'Accessories',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    color: 'Dark Brown',
  },
]
