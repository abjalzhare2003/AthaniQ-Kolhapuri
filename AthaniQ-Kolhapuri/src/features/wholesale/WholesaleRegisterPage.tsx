import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { addWholesaleApplication } from '@/services/dataStore'
import { toast } from '@/stores/toastStore'
import type { BusinessType, WholesaleApplication } from '@/types'

export function WholesaleRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    businessName: '', contactName: '', email: '', phone: '', businessType: 'retailer' as BusinessType,
    address: '', city: '', state: '', pincode: '', gstNumber: '', notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.businessName) errs.businessName = 'Business name is required'
    if (!form.contactName) errs.contactName = 'Contact name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.phone) errs.phone = 'Phone is required'
    if (!form.address) errs.address = 'Address is required'
    if (!form.city) errs.city = 'City is required'
    if (!form.state) errs.state = 'State is required'
    if (!form.pincode) errs.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const application: WholesaleApplication = {
        id: `wapp-${Date.now()}`,
        ...form,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      addWholesaleApplication(application)
      setLoading(false)
      setSubmitted(true)
      toast('success', 'Wholesale application submitted!')
    }, 800)
  }

  if (submitted) {
    return (
      <div className="container-narrow py-12">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wholesale', to: '/wholesale' }, { label: 'Register' }]} />
        <div className="card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><Building2 className="h-8 w-8 text-green-600" /></div>
          <h1 className="mt-4 heading-serif text-2xl font-bold">Application Submitted!</h1>
          <p className="mt-2 text-muted">Thank you for your interest. Our team will review your application and respond within 2–3 business days.</p>
          <Link to="/wholesale/status" className="btn btn-primary mt-4 inline-flex">Check Application Status</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-narrow py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wholesale', to: '/wholesale' }, { label: 'Register' }]} />
      <h1 className="heading-serif text-3xl font-bold">Wholesale Registration</h1>
      <p className="mt-2 text-muted">Fill out the form below to apply for a wholesale account. Fields marked with * are required.</p>

      <form onSubmit={handleSubmit} className="mt-6 card p-6 space-y-4">
        <h2 className="heading-serif text-lg font-semibold border-b border-muted-border pb-3">Business Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Business Name *" name="businessName" value={form.businessName} onChange={handleChange} error={errors.businessName} />
          <Select label="Business Type" name="businessType" value={form.businessType} onChange={handleChange}>
            <option value="retailer">Retailer</option>
            <option value="distributor">Distributor</option>
            <option value="boutique">Boutique</option>
            <option value="online_store">Online Store</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <Input label="Contact Person *" name="contactName" value={form.contactName} onChange={handleChange} error={errors.contactName} />

        <h2 className="heading-serif text-lg font-semibold border-b border-muted-border pb-3 pt-2">Contact Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email *" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <Input label="Phone *" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+91 98765 43210" />
        </div>

        <h2 className="heading-serif text-lg font-semibold border-b border-muted-border pb-3 pt-2">Business Address</h2>
        <Input label="Address *" name="address" value={form.address} onChange={handleChange} error={errors.address} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="City *" name="city" value={form.city} onChange={handleChange} error={errors.city} />
          <Input label="State *" name="state" value={form.state} onChange={handleChange} error={errors.state} />
          <Input label="Pincode *" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} maxLength={6} />
        </div>

        <h2 className="heading-serif text-lg font-semibold border-b border-muted-border pb-3 pt-2">Additional Information</h2>
        <Input label="GST Number (optional)" name="gstNumber" value={form.gstNumber} onChange={handleChange} hint="Required only if applicable to your business type" />
        <Textarea label="Notes (optional)" name="notes" value={form.notes} onChange={handleChange} placeholder="Tell us about your business, existing customers, etc." />

        <label className="flex items-start gap-2 text-sm text-charcoal-50">
          <input type="checkbox" required className="mt-1 rounded border-muted-border text-brand focus:ring-brand" />
          <span>I agree to the <Link to="/policies/terms" className="text-brand hover:text-brand-600">Terms & Conditions</Link> and <Link to="/wholesale" className="text-brand hover:text-brand-600">Wholesale Terms</Link>. I confirm the information provided is accurate.</span>
        </label>

        <Button type="submit" className="w-full" loading={loading}>Submit Application</Button>
      </form>
      <p className="mt-4 text-center text-xs text-muted italic">[Demo application — data is stored in memory only. No document upload is supported in this demo. Real verification must be implemented server-side.]</p>
    </div>
  )
}

function Building2({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l5-4 5 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" /></svg>
}
