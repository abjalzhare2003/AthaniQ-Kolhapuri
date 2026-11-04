import type { SiteContent } from '@/types'

/**
 * Configurable site content for the homepage and storefront.
 * All content here is editable through the Admin > Website Content section.
 * Text marked with [placeholder] is sample content for client review.
 */

export const demoContent: SiteContent = {
  hero: {
    headline: 'Handcrafted Kolhapuri Heritage',
    subheadline:
      'Each pair of AthaniQ Kolhapuri is shaped by master artisans in Kolhapur — leather, thread, and centuries of tradition.',
    ctaText: 'Shop the Collection',
    image: '',
  },
  announcement: {
    enabled: true,
    text: 'Free shipping on orders above ₹2,000 · Flat ₹100 shipping nationwide',
  },
  promoBanner: {
    enabled: true,
    headline: 'Festive Collection — Now Live',
    text: 'Discover our embroidered and mirror-work range for the celebration season.',
    ctaText: 'Explore Festive',
    image: '',
  },
  brandStory: {
    title: 'Rooted in Kolhapur, Crafted for the World',
    body:
      'For generations, our artisans have shaped leather into footwear that carries the spirit of Kolhapur. From the traditional double-stitch to contemporary designs, every AthaniQ pair honours the craft while meeting the needs of the modern wearer. We source premium leather, employ skilled local craftspeople, and take pride in every stitch.',
    image: '',
  },
  benefits: [
    {
      icon: 'hammer',
      title: 'Handcrafted by Master Artisans',
      description: 'Each pair is individually hand-stitched by skilled craftspeople in Kolhapur.',
    },
    {
      icon: 'leaf',
      title: 'Premium Vegetable-Tanned Leather',
      description: 'We use sustainably sourced, vegetable-tanned leather that ages beautifully.',
    },
    {
      icon: 'truck',
      title: 'Free Shipping Above ₹2,000',
      description: 'Flat ₹100 shipping across India. Free shipping on orders above ₹2,000.',
    },
    {
      icon: 'refresh-cw',
      title: '7-Day Easy Returns',
      description: 'Not the right fit? Return within 7 days for an exchange or refund.',
    },
  ],
  testimonials: [
    {
      name: 'Aditya R.',
      role: 'Verified Buyer',
      quote:
        'The quality is exceptional. My Kolhapuri chappals have only gotten better with wear — the leather has developed a beautiful patina.',
    },
    {
      name: 'Sneha M.',
      role: 'Verified Buyer',
      quote:
        'I bought the Peacock Embossed pair for a wedding and received so many compliments. Comfortable and stunning.',
    },
    {
      name: 'Vikram K.',
      role: 'Wholesale Partner',
      quote:
        'As a retailer, AthaniQ has been a reliable wholesale partner. The bulk pricing and MOQ make it easy to stock quality footwear.',
    },
  ],
  newsletter: {
    enabled: true,
    headline: 'Join the AthaniQ Community',
    text: 'Be the first to know about new collections, artisan stories, and exclusive offers.',
  },
}
