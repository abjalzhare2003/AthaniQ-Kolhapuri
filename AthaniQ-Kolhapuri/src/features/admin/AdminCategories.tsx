import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { getCategories, upsertCategory, deleteCategory } from '@/services/dataStore'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Button, Input, Textarea } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { categoryImage } from '@/utils/placeholder'
import { toast } from '@/stores/toastStore'
import type { Category } from '@/types'

export function AdminCategories() {
  const [, forceRender] = useState(0)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '' })

  const categories = getCategories()

  const openEdit = (cat?: Category) => {
    if (cat) { setForm({ name: cat.name, slug: cat.slug, description: cat.description }); setEditCat(cat) }
    else { setForm({ name: '', slug: '', description: '' }); setEditCat({ id: '', name: '', slug: 'men', description: '', image: '', active: true } as unknown as Category) }
  }

  const handleSave = () => {
    if (!form.name) { toast('error', 'Name is required'); return }
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const cat: Category = {
      id: editCat?.id || `cat-${Date.now()}`,
      name: form.name,
      slug: slug as Category['slug'],
      description: form.description,
      image: editCat?.image || categoryImage(form.name, categories.length * 10),
      active: true,
    }
    upsertCategory(cat)
    setEditCat(null)
    forceRender((n) => n + 1)
    toast('success', 'Category saved')
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteCategory(deleteId)
    setDeleteId(null)
    forceRender((n) => n + 1)
    toast('success', 'Category deleted')
  }

  return (
    <div>
      <AdminPageHeader title="Categories" description="Organise your products into categories" actions={<Button size="sm" onClick={() => openEdit()}><Plus className="h-4 w-4" /> Add Category</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="card overflow-hidden">
            <div className="aspect-[21/9] overflow-hidden"><img src={cat.image} alt={cat.name} className="h-full w-full object-cover" /></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1"><h3 className="font-serif font-medium">{cat.name}</h3><Badge variant={cat.active ? 'success' : 'default'}>{cat.active ? 'Active' : 'Inactive'}</Badge></div>
              <p className="text-xs text-muted line-clamp-2 mb-3">{cat.description}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded text-muted hover:text-brand hover:bg-brand-50 transition-colors" aria-label="Edit"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(cat.id)} className="p-1.5 rounded text-muted hover:text-red-600 hover:bg-red-50 transition-colors" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editCat} onClose={() => setEditCat(null)} title={editCat?.id ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <Input label="Name *" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Slug" name="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} hint="URL-friendly name. Leave blank to auto-generate." />
          <Textarea label="Description" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditCat(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p className="text-sm">Are you sure you want to delete this category? Products in this category will need to be reassigned.</p>
        <div className="mt-4 flex justify-end gap-2"><Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></div>
      </Dialog>
    </div>
  )
}
