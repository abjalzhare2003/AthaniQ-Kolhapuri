/**
 * Illustrated placeholder imagery (inline SVG data-URIs).
 *
 * The demo has no photography yet, so footwear / accessories are drawn as
 * warm leather illustrations that match the "Traditional Heritage" theme.
 * Replace `product.images` with real photos at any time — nothing else depends on this file.
 */

type Tone = { sole: string; strap: string; dark: string }

const TONES: Record<string, Tone> = {
  tan: { sole: '#D9A066', strap: '#B5581F', dark: '#7A3511' },
  brown: { sole: '#B27B4C', strap: '#6B3213', dark: '#3E1B08' },
  beige: { sole: '#EED2A6', strap: '#CF9A5E', dark: '#9A6A36' },
  rust: { sole: '#CB8B54', strap: '#9A4318', dark: '#5E2409' },
}
const TONE_KEYS = Object.keys(TONES)

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pickTone(label: string): Tone {
  const l = label.toLowerCase()
  if (l.includes('dark') || l.includes('braided')) return TONES.brown!
  if (l.includes('women') || l.includes('festive') || l.includes('kantha') || l.includes('girls') || l.includes('butterfly')) return TONES.beige!
  if (l.includes('tan') || l.includes('classic')) return TONES.tan!
  return TONES[TONE_KEYS[hashString(label) % TONE_KEYS.length]!]!
}

const esc = (s: string) => s.replace(/[<>&'"]/g, '')

/** One chappal, toe pointing up, drawn in a 200 x 400 box. */
function chappal(id: string, t: Tone): string {
  return `
  <g>
    <defs>
      <linearGradient id="s${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${t.sole}"/><stop offset="1" stop-color="${t.dark}" stop-opacity=".55"/>
      </linearGradient>
      <linearGradient id="b${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${t.strap}"/><stop offset="1" stop-color="${t.dark}"/>
      </linearGradient>
    </defs>
    <path d="M100 8C152 8 178 62 174 140C170 222 160 300 142 360C130 394 70 394 58 360C40 300 30 222 26 140C22 62 48 8 100 8Z" fill="${t.dark}" opacity=".35" transform="translate(6 10)"/>
    <path d="M100 8C152 8 178 62 174 140C170 222 160 300 142 360C130 394 70 394 58 360C40 300 30 222 26 140C22 62 48 8 100 8Z" fill="url(#s${id})" stroke="${t.dark}" stroke-width="3"/>
    <path d="M100 20C144 20 166 68 163 140C160 220 151 296 135 352C126 380 74 380 65 352C49 296 40 220 37 140C34 68 56 20 100 20Z" fill="none" stroke="#FFF3DC" stroke-opacity=".55" stroke-width="2" stroke-dasharray="5 5"/>
    <path d="M26 205C70 168 130 168 174 205" fill="none" stroke="url(#b${id})" stroke-width="34" stroke-linecap="round"/>
    <path d="M28 132C70 98 130 98 172 132" fill="none" stroke="url(#b${id})" stroke-width="32" stroke-linecap="round"/>
    <path d="M100 60V160" stroke="url(#b${id})" stroke-width="16" stroke-linecap="round"/>
    <path d="M36 200C74 172 126 172 164 200M38 128C74 104 126 104 162 128" fill="none" stroke="#FFE9C2" stroke-opacity=".7" stroke-width="2" stroke-dasharray="4 5"/>
    <circle cx="100" cy="64" r="10" fill="${t.dark}" opacity=".85"/>
    <circle cx="100" cy="150" r="5" fill="#FFE9C2" opacity=".8"/>
    <circle cx="100" cy="186" r="5" fill="#FFE9C2" opacity=".8"/>
  </g>`
}

function wrap(w: number, h: number, body: string, bg = ['#FFF8EC', '#F1DFC4']): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><radialGradient id="bg" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>${body}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function pairBody(w: number, h: number, t: Tone, scale: number, rot: [number, number], uid: string): string {
  const s = scale * Math.min(w, h) / 400
  const cx = w / 2
  const cy = h / 2
  return `
  <ellipse cx="${cx}" cy="${cy + 170 * s}" rx="${150 * s}" ry="${18 * s}" fill="#5C2A12" opacity=".18"/>
  <g transform="translate(${cx - 70 * s} ${cy}) rotate(${rot[0]}) scale(${s}) translate(-100 -200)">${chappal(uid + 'a', t)}</g>
  <g transform="translate(${cx + 75 * s} ${cy + 18 * s}) rotate(${rot[1]}) scale(${s}) translate(-100 -200)">${chappal(uid + 'b', t)}</g>`
}

function singleBody(w: number, h: number, t: Tone, scale: number, rot: number, uid: string): string {
  const s = scale * Math.min(w, h) / 400
  return `<g transform="translate(${w / 2} ${h / 2}) rotate(${rot}) scale(${s}) translate(-100 -200)">${chappal(uid, t)}</g>`
}

function accessoryBody(w: number, h: number, label: string): string {
  const l = label.toLowerCase()
  const m = Math.min(w, h)
  const cx = w / 2
  const cy = h / 2
  if (l.includes('belt')) {
    return `<g transform="translate(${cx} ${cy}) rotate(-18) scale(${m / 800})">
      <rect x="-330" y="-34" width="660" height="68" rx="14" fill="#6B3213" stroke="#3E1B08" stroke-width="4"/>
      <rect x="-318" y="-22" width="636" height="44" rx="8" fill="none" stroke="#E8C48D" stroke-opacity=".6" stroke-width="2" stroke-dasharray="8 7"/>
      <rect x="-80" y="-58" width="96" height="116" rx="14" fill="none" stroke="#E3B15B" stroke-width="12"/>
      <rect x="-26" y="-4" width="64" height="8" rx="4" fill="#E3B15B"/>
    </g>`
  }
  if (l.includes('wallet')) {
    return `<g transform="translate(${cx} ${cy}) rotate(-8) scale(${m / 800})">
      <rect x="-190" y="-130" width="380" height="260" rx="26" fill="#9A5A28" stroke="#3E1B08" stroke-width="5"/>
      <rect x="-170" y="-110" width="340" height="220" rx="16" fill="none" stroke="#F1D6A6" stroke-opacity=".65" stroke-width="3" stroke-dasharray="9 8"/>
      <path d="M-190 -30H190" stroke="#3E1B08" stroke-width="4" opacity=".5"/>
      <circle cx="120" cy="30" r="16" fill="#E3B15B"/>
    </g>`
  }
  return `<g transform="translate(${cx} ${cy}) scale(${m / 800})">
    <rect x="-170" y="-110" width="340" height="220" rx="20" fill="#7A3B1A" stroke="#3E1B08" stroke-width="5"/>
    <rect x="-140" y="-70" width="110" height="140" rx="12" fill="#E3B15B"/>
    <rect x="-10" y="-70" width="150" height="60" rx="10" fill="#F1D6A6"/>
    <rect x="-10" y="10" width="150" height="60" rx="10" fill="#C27622"/>
  </g>`
}

/** Illustration for a label; `index` varies the composition between gallery shots. */
export function placeholderImage(label: string, index: number, w = 800, h = 800, scale?: number): string {
  const l = label.toLowerCase()
  const t = pickTone(label)
  const uid = `i${index}x`
  if (l.includes('belt') || l.includes('wallet') || l.includes('care kit') || l.includes('accessor')) {
    return wrap(w, h, accessoryBody(w, h, label))
  }
  if (l.includes('wholesale')) {
    return wrap(w, h, pairBody(w, h, t, 0.8, [-28, 16], uid), ['#6E3515', '#3A1A0A'])
  }
  if (l.includes('artisan') || l.includes('story') || l.includes('heritage')) {
    return wrap(w, h, pairBody(w, h, t, 0.75, [-35, 20], uid), ['#EBD5B3', '#C9A06B'])
  }
  const shot = index % 4
  const body =
    scale !== undefined ? pairBody(w, h, t, scale, [-26, 14], uid) :
    shot === 1 ? singleBody(w, h, t, 1.55, -32, uid) :
    shot === 2 ? singleBody(w, h, t, 1.05, 62, uid) :
    shot === 3 ? pairBody(w, h, t, 0.78, [12, -18], uid) :
    pairBody(w, h, t, 0.95, [-26, 14], uid)
  return wrap(w, h, body)
}

/** Generate multiple gallery images for a product. */
export function productImages(label: string, baseIndex: number): string[] {
  const l = esc(label)
  return [0, 1, 2, 3].map((i) => placeholderImage(l, baseIndex - (baseIndex % 4) + i))
}

/** Generate a category image. */
export function categoryImage(label: string, index: number): string {
  const l = label.toLowerCase()
  if (l.includes('accessor')) return placeholderImage('Kolhapuri Leather Wallet', 0, 1000, 800)
  if (l.includes('women')) return placeholderImage('Womens Beige Sandal', 0, 1000, 800)
  if (l.includes('kids')) return placeholderImage('Kids Tan Chappal', 0, 1000, 800)
  return placeholderImage(label + ' Classic Tan', index - (index % 4), 1000, 800)
}
