import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { NotFoundPage } from '@/features/storefront/NotFoundPage'

const policyContent: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  shipping: {
    title: 'Shipping Policy',
    sections: [
      { heading: 'Processing Time', body: 'Orders are processed within 1–2 business days of placement. You will receive a confirmation email once your order has been dispatched.' },
      { heading: 'Delivery Time', body: 'Standard delivery takes 3–5 business days across India. Express delivery (1–2 days) is available for select pin codes at an additional charge.' },
      { heading: 'Shipping Charges', body: 'Flat ₹100 shipping on all orders. Orders above ₹2,000 qualify for free shipping.' },
      { heading: 'Tracking', body: 'A tracking reference will be shared via email once your order is shipped. You can also track your order from My Account → My Orders.' },
    ],
  },
  returns: {
    title: 'Returns & Exchanges Policy',
    sections: [
      { heading: 'Return Window', body: 'You may return any item within 7 days of delivery, provided it is unworn and in its original packaging.' },
      { heading: 'How to Request a Return', body: 'Visit My Account → Returns, select the order and items you wish to return, choose a reason, and submit. We will review your request and arrange a pickup.' },
      { heading: 'Refund Processing', body: 'Refunds are processed to the original payment method within 5–7 business days of receiving the returned item.' },
      { heading: 'Exchanges', body: 'Size exchanges are free. To exchange, request a return and place a new order for the desired size.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Information We Collect', body: 'We collect information you provide when you create an account, place an order, or contact us — including name, email, phone, and shipping address.' },
      { heading: 'How We Use Your Information', body: 'Your information is used to process orders, provide customer support, and send order updates. We do not sell your data to third parties.' },
      { heading: 'Data Security', body: 'We take reasonable measures to protect your personal information. Payment details are processed through secure gateways and are not stored on our servers.' },
      { heading: 'Your Rights', body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us.' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    sections: [
      { heading: 'Acceptance of Terms', body: 'By accessing and using this website, you accept and agree to be bound by these terms and conditions.' },
      { heading: 'Product Information', body: 'We strive to display product information accurately. However, we do not warrant that descriptions, pricing, or other content is error-free.' },
      { heading: 'Pricing', body: 'All prices are listed in Indian Rupees (₹) and are subject to change without notice. Final pricing is confirmed at checkout.' },
      { heading: 'Limitation of Liability', body: 'AthaniQ Kolhapuri shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.' },
    ],
  },
}

export function PolicyPage({ policy }: { policy: keyof typeof policyContent }) {
  const content = policyContent[policy]
  if (!content) return <NotFoundPage />
  return (
    <div className="container-narrow py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: content.title }]} />
      <h1 className="heading-serif text-4xl font-bold">{content.title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated: November 2025</p>
      <div className="mt-8 space-y-6">
        {content.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="heading-serif text-xl font-semibold">{section.heading}</h2>
            <p className="mt-2 text-charcoal-50 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted italic">
        [Sample policy content — must be reviewed and finalized by legal counsel before production launch.]
      </p>
    </div>
  )
}
