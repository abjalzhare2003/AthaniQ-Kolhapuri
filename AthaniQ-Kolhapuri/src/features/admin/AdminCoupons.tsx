import { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { getCoupons, addCoupon, updateCoupon, deleteCoupon } from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Button, Input, Select } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/utils/format'
import { toast } from '@/stores/toastStore'
import type { Coupon } from '@/types'

export function AdminCoupons() {
  const [, forceRender] = useState(0)
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ code: '', description: '', type: 'percentage' as 'percentage' | 'fixed', value: '', minOrderValue: '0', validFrom: '', validUntil: '' })

  const coupons = getCoupons()

  const openEdit = (c?: Coupon) => {
    if (c) { setForm({ code: c.code, description: c.description, type: c.type, value: String(c.value), minOrderValue: String(c.minOrderValue), validFrom: c.validFrom.slice(0, 10), validUntil: c.validUntil.slice(0, 10) }); setEditCoupon(c) }
    else { setForm({ code: '', description: '', type: 'percentage', value: '', minOrderValue: '0', validFrom: '', validUntil: '' }); setEditCoupon({ id: '', code: '', description: '', type: 'percentage', value: 0, minOrderValue: 0, validFrom: '', validUntil: '', active: true, usageCount: 0 }) }
  }

  const handleSave = () => {
    if (!form.code || !form.value) { toast('error', 'Code and value are required'); return }
    const now = Date.now()
    const coupon: Coupon = {
      id: editCoupon?.id || `coupon-${now}`,
      code: form.code.toUpperCase(),
      description: form.description,
      type: form.type,
      value: Number(form.value),
      minOrderValue: Number(form.minOrderValue),
      validFrom: new Date(form.validFrom).toISOString(),
      validUntil: new Date(form.validUntil).toISOString(),
      active: true,
      usageCount: editCoupon?.usageCount ?? 0,
    }
    if (editCoupon?.id) updateCoupon(coupon.id, coupon)
    else addCoupon(coupon)
    setEditCoupon(null)
    forceRender((n) => n + 1)
    toast('success', 'Coupon saved')
  }

  return (
    <div>
      <AdminPageHeader title="Coupons & Offers" description="Create and manage discount coupons" actions={<Button size="sm" onClick={() => openEdit()}><Plus className="h-4 w-4" /> Add Coupon</Button>} />
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted-bg border-b border-muted-border"><tr>{['Code', 'Description', 'Type', 'Value', 'Min Order', 'Valid Until', 'Status', 'Used', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-muted-border">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-muted-bg/50">
                  <td className="px-4 py-3 text-sm font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3 text-sm text-muted">{c.description}</td>
                  <td className="px-4 py-3 text-sm capitalize">{c.type}</td>
                  <td className="px-4 py-3 text-sm">{c.type === 'percentage' ? `${c.value}%` : formatCurrency(c.value)}</td>
                  <td className="px-4 py-3 text-sm">{c.minOrderValue > 0 ? formatCurrency(c.minOrderValue) : '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted">{formatDate(c.validUntil)}</td>
                  <td className="px-4 py-3"><Badge variant={c.active ? 'success' : 'default'}>{c.active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-4 py-3 text-sm text-muted">{c.usageCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded text-muted hover:text-brand hover:bg-brand-50" aria-label="Edit"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded text-muted hover:text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editCoupon} onClose={() => setEditCoupon(null)} title={editCoupon?.id ? 'Edit Coupon' : 'Add Coupon'}>
        <div className="space-y-4">
          <Input label="Coupon Code *" name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <Input label="Description" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Discount Type" name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed (₹)</option></Select>
            <Input label="Value *" name="value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <Input label="Min Order Value (₹)" name="minOrderValue" type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Valid From" name="validFrom" type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
            <Input label="Valid Until" name="validUntil" type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditCoupon(null)}>Cancel</Button><Button onClick={handleSave}>Save</Button></div>
        </div>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Coupon" size="sm">
        <p className="text-sm">Are you sure you want to delete this coupon? It will no longer be usable.</p>
        <div className="mt-4 flex justify-end gap-2"><Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button><Button variant="danger" onClick={() => { if (deleteId) { deleteCoupon(deleteId); setDeleteId(null); forceRender((n) => n + 1); toast('success', 'Coupon deleted') } }}>Delete</Button></div>
      </Dialog>
    </div>
  )
}
