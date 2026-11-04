import { useState } from 'react'
import { Input, Button } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/stores/toastStore'

export function AccountProfile() {
  const { user, updateProfile } = useAuthStore()
  const [form, setForm] = useState({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', phone: user?.phone ?? '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(form)
    toast('success', 'Profile updated successfully')
  }

  return (
    <div className="card p-6 max-w-lg">
      <h2 className="heading-serif text-lg font-semibold mb-4">Profile Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First Name" name="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input label="Last Name" name="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <Input label="Email" value={user?.email ?? ''} disabled className="opacity-60" />
        <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}
