import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'
import { AuthShell } from './AuthShell'
import { SocialButtons } from './SocialButtons'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const result = login(email, password)
      setLoading(false)
      if (result.success) {
        toast('success', result.message)
        navigate('/account')
      } else {
        setErrors({ password: result.message })
      }
    }, 500)
  }

  return (
    <AuthShell>
      <h1 className="text-center font-serif text-2xl font-semibold text-brand-700">Welcome Back</h1>
      <p className="mt-1 text-center text-sm text-muted">Login to your account</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" error={errors.email} autoComplete="email" />
        <div className="relative">
          <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" error={errors.password} autoComplete="current-password" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-muted hover:text-charcoal" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="text-right text-sm">
          <Link to="/forgot-password" className="font-medium text-brand hover:text-brand-600">Forgot Password?</Link>
        </div>
        <Button type="submit" className="w-full py-3" loading={loading}>Login</Button>
      </form>

      <SocialButtons />

      <div className="mt-5 rounded-md bg-accent-50 p-3 text-xs text-accent-600">
        <strong>Demo logins:</strong> demo@athaniq.com / demo123 · wholesale@athaniq.com / wholesale123
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        New here? <Link to="/register" className="font-semibold text-brand hover:text-brand-600">Create an account</Link>
      </p>
    </AuthShell>
  )
}
