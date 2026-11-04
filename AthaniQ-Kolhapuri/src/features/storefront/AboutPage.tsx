import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { placeholderImage } from '@/utils/placeholder'

export function AboutPage() {
  return (
    <div className="container-narrow py-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />
      <div className="mb-8 aspect-[21/9] overflow-hidden rounded-2xl">
        <img src={placeholderImage('AthaniQ Kolhapuri Heritage Story', 55)} alt="AthaniQ Kolhapuri workshop" className="h-full w-full object-cover" />
      </div>
      <h1 className="heading-serif text-4xl font-bold text-center">Our Story</h1>
      <div className="mt-8 space-y-4 text-charcoal-50 leading-relaxed">
        <p>
          AthaniQ Kolhapuri was born from a deep respect for the centuries-old craft of Kolhapuri
          footwear making. The town of Kolhapur, in Maharashtra, has been home to master leather
          artisans for generations — and we are honoured to carry that legacy forward.
        </p>
        <p>
          Every pair of AthaniQ Kolhapuri is hand-stitched by skilled craftspeople using premium
          vegetable-tanned leather. From cutting and shaping to stitching and finishing, each step
          is done by hand, ensuring a level of quality and character that machine-made footwear
          simply cannot match.
        </p>
        <p>
          Our mission is twofold: to bring the beauty and durability of authentic Kolhapuri
          footwear to customers across India and beyond, and to support the artisan community
          that keeps this tradition alive. We work directly with our craftspeople, ensuring fair
          wages and sustainable practices.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { title: 'Our Craft', text: 'Hand-stitched, vegetable-tanned, made to last.' },
          { title: 'Our Community', text: 'Supporting Kolhapur artisan families with fair wages.' },
          { title: 'Our Promise', text: 'Quality you can feel, heritage you can wear.' },
        ].map((item) => (
          <div key={item.title} className="card p-6 text-center">
            <h3 className="heading-serif text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted italic">
        [Sample content — business details and history to be verified by the client before launch.]
      </p>
    </div>
  )
}
