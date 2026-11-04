/** Maps product colour names to swatch colours for filters and selectors. */
const SWATCHES: Record<string, string> = {
  tan: '#C8641E',
  'dark brown': '#4A2410',
  black: '#1E1612',
  camel: '#B98A52',
  cognac: '#8E3F17',
  gold: '#C9A24A',
  'rose gold': '#C98C7E',
  ivory: '#F2E8D3',
  natural: '#D9BE93',
  nude: '#D8AE8E',
  olive: '#6B6B34',
  pink: '#E39AA8',
  beige: '#D8B98A',
  'tan brown': '#C8641E',
}

export function colorSwatch(name: string): string {
  return SWATCHES[name.toLowerCase()] ?? '#B08A62'
}
