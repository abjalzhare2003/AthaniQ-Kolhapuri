import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { Input, Button } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'

export function AdminLogin() {
  const navigate = useNavigate()
  const { loginAdmin } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter both email and password'); return }
    setLoading(true)
    setTimeout(() => {
      const result = loginAdmin(email, password)
      setLoading(false)
      if (result.success) {
        toast('success', result.message)
        navigate('/admin')
      } else {
        setError(result.message)
      }
    }, 500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand"><ShieldCheck className="h-8 w-8 text-white" /></div>
          <h1 className="heading-serif text-2xl font-bold text-white">Admin Portal</h1>
          <p className="mt-1 text-sm text-white/60">AthaniQ Kolhapuri Management</p>
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@athaniq.com" autoComplete="email" error={error ? '' : undefined} />
            <div className="relative">
              <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" error={error || undefined} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-muted hover:text-charcoal" aria-label={showPassword ? 'Hide' : 'Show'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
            <Button type="submit" className="w-full" loading={loading}><Lock className="h-4 w-4" /> Sign In</Button>
          </form>
          <div className="mt-4 rounded-lg bg-accent-50 p-3 text-xs text-accent-700 flex items-center justify-between border border-accent-200">
            <div>
              <strong>Demo credentials:</strong>
              <div className="text-3xs text-muted">admin@athaniq.com / admin123</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@athaniq.com')
                setPassword('admin123')
              }}
              className="px-2 py-1 bg-brand text-white rounded text-3xs font-semibold hover:bg-brand-600 transition"
            >
              Fill Credentials
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-white/40 italic">[Demo admin authentication — NOT production secure.]</p>
      </div>
    </div>
  )
}
