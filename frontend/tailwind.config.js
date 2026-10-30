/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          50: '#FDF4F5',
          100: '#FCE8EB',
          200: '#F7C6CD',
          300: '#E898A6',
          400: '#D45D72',
          500: '#9E1B38',
          600: '#7B1127',
          700: '#6B0F24', // Primary Apple Eats Maroon
          800: '#580B1C', // Hover State
          900: '#4A0716', // Active Press State
          950: '#2E030C',
        },
        gold: {
          400: '#FBBF24',
          500: '#D4AF37', // Gold Accent
          600: '#B8860B',
        },
        surface: {
          light: '#F8F5F2',
          card: '#FFFFFF',
          border: '#E5E7EB',
          muted: '#F3F4F6',
        },
        rating: '#D97706',
        leaf: '#22C55E',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'card': '20px',
        'input': '12px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(107, 15, 36, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 28px -4px rgba(107, 15, 36, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'modal': '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        'floating-bar': '0 -4px 24px rgba(0, 0, 0, 0.08), 0 -1px 4px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
