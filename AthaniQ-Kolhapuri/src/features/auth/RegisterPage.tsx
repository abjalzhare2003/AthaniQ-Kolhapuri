import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'
import { AuthShell } from './AuthShell'
import { SocialButtons } from './SocialButtons'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.firstName) errs.firstName = 'First name is required'
    if (!form.lastName) errs.lastName = 'Last name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const result = register({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, phone: form.phone })
      setLoading(false)
      if (result.success) {
        toast('success', result.message)
        navigate('/account')
      }
    }, 500)
  }

  return (
    <AuthShell>
      <h1 className="text-center font-serif text-2xl font-semibold text-brand-700">Create Account</h1>
      <p className="mt-1 text-center text-sm text-muted">Join the AthaniQ community</p>
      <div className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Aarav" error={errors.firstName} />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sharma" error={errors.lastName} />
            </div>
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} />
            <Input label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" error={errors.password} />
            <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" error={errors.confirmPassword} />
            <Button type="submit" className="w-full py-3" loading={loading}>Create Account</Button>
          </form>
        <SocialButtons />
        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand hover:text-brand-600">Login</Link>
        </p>
      </div>
    </AuthShell>
  )
}
