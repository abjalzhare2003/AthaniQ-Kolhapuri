import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from '@/stores/toastStore'
import { AuthShell } from './AuthShell'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Email is required'); return }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email'); return }
    setSent(true)
    toast('info', `Password reset link sent to ${email} (demo)`)
  }

  return (
    <AuthShell hideTabs>
      <div>
        <h1 className="heading-serif text-3xl font-bold text-center">Forgot Password</h1>
        {sent ? (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-4 heading-serif text-xl">Check Your Email</h2>
            <p className="mt-2 text-sm text-muted">We've sent a password reset link to <strong>{email}</strong>. Follow the link to reset your password.</p>
            <Link to="/login" className="btn btn-primary mt-4 inline-flex">Back to Login</Link>
          </div>
        ) : (
          <div className="mt-6">
            <p className="mb-4 text-sm text-muted">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" error={error} />
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
            <Link to="/login" className="mt-4 block text-center text-sm text-brand hover:text-brand-600">Back to Login</Link>
          </div>
        )}
        <p className="mt-4 text-center text-xs text-muted italic">
          [Demo flow — password reset requires backend integration before launch.]
        </p>
      </div>
    </AuthShell>
  )
}
