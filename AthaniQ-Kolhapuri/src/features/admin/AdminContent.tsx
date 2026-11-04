import { useState } from 'react'
import { Save } from 'lucide-react'
import { demoContent } from '@/data/demoContent'
import { AdminPageHeader } from '@/components/layout/AdminPageHeader'
import { Input, Textarea, Button } from '@/components/ui/Input'
import { toast } from '@/stores/toastStore'

export function AdminContent() {
  const [content, setContent] = useState(demoContent)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast('success', 'Content saved (demo — changes apply to this session only)')
  }

  return (
    <div>
      <AdminPageHeader title="Website Content" description="Edit homepage banners, brand story, and announcement bar. [Changes are in-session only in demo mode.]" />
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="heading-serif text-lg font-semibold">Announcement Bar</h2>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={content.announcement.enabled} onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, enabled: e.target.checked } })} className="rounded border-muted-border text-brand focus:ring-brand" />
            Show announcement bar
          </label>
          <Input label="Announcement Text" value={content.announcement.text} onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, text: e.target.value } })} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="heading-serif text-lg font-semibold">Hero Section</h2>
          <Input label="Headline" value={content.hero.headline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })} />
          <Textarea label="Subheadline" value={content.hero.subheadline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })} />
          <Input label="CTA Button Text" value={content.hero.ctaText} onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaText: e.target.value } })} />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="heading-serif text-lg font-semibold">Brand Story</h2>
          <Input label="Title" value={content.brandStory.title} onChange={(e) => setContent({ ...content, brandStory: { ...content.brandStory, title: e.target.value } })} />
          <Textarea label="Story" value={content.brandStory.body} onChange={(e) => setContent({ ...content, brandStory: { ...content.brandStory, body: e.target.value } })} className="min-h-[120px]" />
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="heading-serif text-lg font-semibold">Promotional Banner</h2>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={content.promoBanner.enabled} onChange={(e) => setContent({ ...content, promoBanner: { ...content.promoBanner, enabled: e.target.checked } })} className="rounded border-muted-border text-brand focus:ring-brand" />
            Show promotional banner
          </label>
          <Input label="Headline" value={content.promoBanner.headline} onChange={(e) => setContent({ ...content, promoBanner: { ...content.promoBanner, headline: e.target.value } })} />
          <Input label="Body Text" value={content.promoBanner.text} onChange={(e) => setContent({ ...content, promoBanner: { ...content.promoBanner, text: e.target.value } })} />
          <Input label="CTA Text" value={content.promoBanner.ctaText} onChange={(e) => setContent({ ...content, promoBanner: { ...content.promoBanner, ctaText: e.target.value } })} />
        </div>

        <Button type="submit" className="sticky bottom-4"><Save className="h-4 w-4" /> Save Changes</Button>
      </form>
    </div>
  )
}
