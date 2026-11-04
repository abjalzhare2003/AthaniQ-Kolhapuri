/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — "Traditional Heritage": cream, chocolate brown, tan-orange
        ivory: {
          DEFAULT: '#FBF6EE',
          50: '#FFFDF9',
          100: '#FBF6EE',
          200: '#F4EADB',
          300: '#EADBC5',
        },
        charcoal: {
          DEFAULT: '#2B1A10',
          50: '#7A6455',
          100: '#5E4A3C',
          200: '#46332A',
          300: '#3A281D',
          400: '#2B1A10',
          500: '#22140C',
          600: '#1A0F08',
        },
        brand: {
          DEFAULT: '#5C2A12',
          50: '#F8EFE6',
          100: '#F0DFD0',
          200: '#D9B49A',
          300: '#A8643A',
          400: '#7A3B1A',
          500: '#5C2A12',
          600: '#46200D',
          700: '#351808',
        },
        accent: {
          DEFAULT: '#E39A3B',
          50: '#FDF3E3',
          100: '#FAE3BF',
          200: '#F3C987',
          300: '#EBB05B',
          400: '#E39A3B',
          500: '#C97F22',
          600: '#9C5F16',
        },
        muted: {
          DEFAULT: '#8C7868',
          foreground: '#6E5B4D',
          bg: '#F6EEE2',
          border: '#E8DCCB',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      maxWidth: {
        content: '1280px',
        'content-narrow': '1024px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(70, 32, 13, 0.07)',
        card: '0 6px 24px rgba(70, 32, 13, 0.12)',
        elevated: '0 10px 36px rgba(70, 32, 13, 0.18)',
      },
      zIndex: {
        base: '1',
        dropdown: '10',
        sticky: '20',
        header: '30',
        drawer: '40',
        modal: '50',
        toast: '60',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '250ms',
        slow: '400ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms ease-out',
        'fade-up': 'fade-up 400ms ease-out',
        'slide-in-right': 'slide-in-right 300ms ease-out',
        'scale-in': 'scale-in 200ms ease-out',
        marquee: 'marquee 30s linear infinite',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
