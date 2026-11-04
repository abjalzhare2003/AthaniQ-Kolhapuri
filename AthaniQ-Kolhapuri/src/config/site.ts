/**
 * Centralized site configuration for branding, navigation, and demo settings.
 */

export const siteConfig = {
  brand: {
    name: 'AthaniQ Kolhapuri',
    shortName: 'AthaniQ',
    tagline: 'Handcrafted Heritage Footwear',
    city: 'Kolhapur',
    team: 'GrowForge',
    teamTagline: 'Engineering Digital Experiences That Drive Business Growth.',
    email: 'contact@athaniqkolhapuri.com',
    phone: '+91 XXXXX XXXXX',
    address: '[Client address to be confirmed]',
    social: {
      instagram: 'https://instagram.com/athaniqkolhapuri',
      facebook: 'https://facebook.com/athaniqkolhapuri',
    },
  },

  nav: [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Men', to: '/category/men' },
    { label: 'Women', to: '/category/women' },
    { label: 'Kids', to: '/category/kids' },
    { label: 'Wholesale', to: '/wholesale' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],

  footerLinks: {
    shop: [
      { label: 'All Products', to: '/shop' },
      { label: 'Men', to: '/category/men' },
      { label: 'Women', to: '/category/women' },
      { label: 'Kids', to: '/category/kids' },
      { label: 'Leather Accessories', to: '/category/accessories' },
    ],
    company: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Wholesale', to: '/wholesale' },
    ],
    policies: [
      { label: 'Shipping Policy', to: '/policies/shipping' },
      { label: 'Returns & Exchanges', to: '/policies/returns' },
      { label: 'Privacy Policy', to: '/policies/privacy' },
      { label: 'Terms & Conditions', to: '/policies/terms' },
    ],
    account: [
      { label: 'My Account', to: '/account' },
      { label: 'My Orders', to: '/account/orders' },
      { label: 'Wishlist', to: '/account/wishlist' },
      { label: 'Cart', to: '/cart' },
    ],
  },

  demo: {
    /** NOTE: This is a frontend-only demo adapter. NOT production authentication. */
    customers: [
      { email: 'demo@athaniq.com', password: 'demo123', name: 'Demo Customer' },
      { email: 'wholesale@athaniq.com', password: 'wholesale123', name: 'Wholesale Buyer' },
    ],
    admin: { email: 'admin@athaniq.com', password: 'admin123' },
  },

  shipping: {
    flatRate: 100,
    freeThreshold: 2000,
    estimatedTaxRate: 0.05,
  },

  lowStockThreshold: 5,
} as const
