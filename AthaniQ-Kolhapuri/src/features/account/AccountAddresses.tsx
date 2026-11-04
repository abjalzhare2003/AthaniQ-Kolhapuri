import { getCurrentCustomer } from '@/stores/authStore'
import { EmptyState } from '@/components/ui/EmptyState'
import { MapPin } from 'lucide-react'

export function AccountAddresses() {
  const customer = getCurrentCustomer()
  const addresses = customer?.addresses ?? []

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No addresses saved" message="Add a shipping address to speed up checkout." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="badge bg-muted-bg text-charcoal-50">{addr.label}</span>
                {addr.isDefault && <span className="badge bg-brand-50 text-brand-500">Default</span>}
              </div>
              <p className="font-medium text-charcoal">{addr.fullName}</p>
              <p className="text-sm text-muted mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="text-sm text-muted">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-muted">{addr.phone}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted italic">[Address editing requires backend integration. Demo addresses are read-only.]</p>
    </div>
  )
}
