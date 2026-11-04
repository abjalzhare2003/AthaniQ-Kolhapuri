import { toast } from '@/stores/toastStore'

export function SocialButtons() {
  const soon = (name: string) => toast('info', `${name} sign-in needs backend setup — not available in the demo.`)
  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-muted-border" />or continue with<span className="h-px flex-1 bg-muted-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => soon('Google')} className="btn border border-muted-border bg-white py-2.5 text-charcoal hover:bg-brand-50">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-8Z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z" /><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.4V7H2.1a11 11 0 0 0 0 9.9l3.7-2.7Z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.8C6.700 7.300 9.100 5.400 12 5.400Z" /></svg>
          Google
        </button>
        <button type="button" onClick={() => soon('WhatsApp')} className="btn border border-muted-border bg-white py-2.5 text-charcoal hover:bg-brand-50">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><circle cx="12" cy="12" r="11" fill="#25D366" /><path fill="#fff" d="M12 5.5a6.4 6.4 0 0 0-5.5 9.700L5.600 18.400l3.300-.9A6.400 6.400 0 1 0 12 5.500Zm3.700 8.900c-.2.500-1 .900-1.400 1-.400 0-.800.200-2.700-.600-2.300-.900-3.700-3.200-3.800-3.300-.1-.2-.9-1.200-.9-2.200s.5-1.500.7-1.700c.2-.2.400-.2.500-.2h.4c.1 0 .3 0 .4.300l.6 1.500c.1.100.1.300 0 .400l-.3.400-.3.300c-.1.100-.2.300-.1.500.1.200.600 1 1.300 1.600.9.800 1.600 1 1.800 1.100.2.100.400.100.500-.1l.7-.8c.2-.2.300-.2.500-.1l1.500.7c.2.100.3.200.4.300.1.200.1.600-.1 1.100Z" /></svg>
          WhatsApp
        </button>
      </div>
    </>
  )
}
