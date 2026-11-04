import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/config/site'
import { toast } from '@/stores/toastStore'

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    toast('success', 'Message sent! We will get back to you soon.')
  }

  return (
    <div className="container-narrow py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
      <h1 className="heading-serif text-4xl font-bold text-center">Contact Us</h1>
      <p className="mt-2 text-center text-muted">We'd love to hear from you. Reach out with any questions.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Contact info */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="heading-serif text-lg font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-3"><Mail className="h-5 w-5 text-brand mt-0.5 flex-shrink-0" /> {siteConfig.brand.email}</p>
              <p className="flex items-start gap-3"><Phone className="h-5 w-5 text-brand mt-0.5 flex-shrink-0" /> {siteConfig.brand.phone}</p>
              <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-brand mt-0.5 flex-shrink-0" /> {siteConfig.brand.address}</p>
            </div>
            <p className="mt-4 text-xs text-muted italic">[Contact details are placeholders — to be confirmed by the client.]</p>
          </div>
          <div className="card p-6">
            <h2 className="heading-serif text-lg font-semibold mb-2">Business Hours</h2>
            <p className="text-sm text-muted">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
            <p className="text-sm text-muted">Sunday: Closed</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="card p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mt-4 heading-serif text-xl">Message Sent!</h2>
              <p className="mt-1 text-sm text-muted">Thank you for reaching out. We'll respond within 1–2 business days.</p>
              <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>Send another message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First Name" name="firstName" required placeholder="Your first name" />
                <Input label="Last Name" name="lastName" required placeholder="Your last name" />
              </div>
              <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
              <Input label="Subject" name="subject" required placeholder="How can we help?" />
              <Textarea label="Message" name="message" required placeholder="Your message…" className="min-h-[120px]" />
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
