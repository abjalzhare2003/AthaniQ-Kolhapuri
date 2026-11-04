import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface LogoProps {
  to?: string
  /** "dark" for light backgrounds, "light" for brown backgrounds. */
  tone?: 'dark' | 'light'
  size?: 'md' | 'lg'
  className?: string
}

/** Official AthaniQ Kolhapuri logo (Est. 1971). */
export function Logo({ to = '/', tone = 'dark', size = 'md', className }: LogoProps) {
  const file = tone === 'dark' ? 'logo.png' : 'logo-light.png'
  return (
    <Link to={to} aria-label="AthaniQ Kolhapuri home" className={cn('flex items-center flex-shrink-0', className)}>
      <img
        src={`${import.meta.env.BASE_URL}${file}`}
        alt="AthaniQ Kolhapuri — Est. 1971"
        className={cn('w-auto object-contain', size === 'lg' ? 'h-28' : 'h-[60px]')}
        draggable={false}
      />
    </Link>
  )
}
