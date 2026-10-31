/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        af: {
          dark: '#070B16',
          surface: '#0A1020',
          card: '#0F1729',
          cardHover: '#131e35',
          subtle: '#0D1526',
          sidebar: '#0B1222',
          border: '#1E2A44',
          borderLight: '#26324A',
          borderSubtle: '#1A2440',
          text: '#E6EDF7',
          muted: '#A3B1C6',
          dim: '#8696AE',
          ok: '#34D399',
          okLight: '#6EE7B7',
          warn: '#FBBF24',
          warnLight: '#FCD34D',
          danger: '#F87171',
          dangerLight: '#FCA5A5',
          blue: '#2563EB',
          blueLight: '#60A5FA',
          teal: '#14B8A6',
          tealLight: '#22C7B8',
        }
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2563EB, #1990EE 55%, #14B8A6)',
        'text-gradient': 'linear-gradient(90deg, #3B82F6, #22C7B8 60%, #34D399)',
        'card-gradient': 'linear-gradient(180deg, #101A2E, #0D1526)',
        'glow-gradient': 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
