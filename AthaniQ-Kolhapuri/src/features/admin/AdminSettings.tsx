import { useState } from 'react'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Input, Button } from '@/components/ui/Input'
import { resetDemoData } from '@/services/dataStore'
import { toast } from '@/stores/toastStore'
import { siteConfig } from '@/config/site'

export function AdminSettings() {
  const [, forceRender] = useState(0)

  const handleReset = () => {
    resetDemoData()
    forceRender((n) => n + 1)
    toast('success', 'Demo data reset to initial state')
  }

  return (
    <div>
      <AdminPageHeader title="Settings" description="Site configuration and demo management" />
      <div className="space-y-6 max-w-2xl">
        <div className="card p-6 space-y-4">
          <h2 className="heading-serif text-lg font-semibold">Brand Information</h2>
          <p className="text-sm text-muted">These are placeholder values — edit <code>src/config/site.ts</code> to update brand settings.</p>
          <Input label="Brand Name" value={siteConfig.brand.name} readOnly className="opacity-60" />
          <Input label="Contact Email" value={siteConfig.brand.email} readOnly className="opacity-60" />
          <Input label="Contact Phone" value={siteConfig.brand.phone} readOnly className="opacity-60" />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="heading-serif text-lg font-semibold">Shipping Settings</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Flat Shipping Rate (₹)" value={siteConfig.shipping.flatRate} readOnly className="opacity-60" />
            <Input label="Free Shipping Threshold (₹)" value={siteConfig.shipping.freeThreshold} readOnly className="opacity-60" />
          </div>
          <p className="text-xs text-muted">Edit <code>src/config/site.ts</code> to update shipping configuration.</p>
        </div>

        <div className="card p-6 border-red-200">
          <h2 className="heading-serif text-lg font-semibold text-red-600">Demo Data Management</h2>
          <p className="mt-1 text-sm text-muted">Reset all demo data to the initial state. This will revert all admin changes made during this session.</p>
          <Button variant="danger" className="mt-3" onClick={handleReset}>Reset All Demo Data</Button>
        </div>

        <div className="card p-6">
          <h2 className="heading-serif text-lg font-semibold mb-2">Demo Credentials</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Admin:</strong> admin@athaniq.com / admin123</p>
            <p><strong>Customer:</strong> demo@athaniq.com / demo123</p>
            <p><strong>Wholesale:</strong> wholesale@athaniq.com / wholesale123</p>
          </div>
          <p className="mt-3 text-xs text-muted italic">⚠️ Demo credentials only — NOT production secure.</p>
        </div>
      </div>
    </div>
  )
}
