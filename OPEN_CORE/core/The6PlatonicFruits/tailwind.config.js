/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: { DEFAULT: 'var(--background)' },
        foreground: { DEFAULT: 'var(--foreground)' },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        terminal: {
          green: 'var(--green-bright)',
          dim: 'var(--green-dim)',
          dark: 'var(--green-dark)',
          muted: 'var(--green-muted)',
          glow: 'var(--green-glow)',
          surface1: 'var(--surface-1)',
          surface2: 'var(--surface-2)',
          surface3: 'var(--surface-3)',
          amber: 'var(--amber-warn)',
          red: 'var(--red-alert)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius)',
        md: 'var(--radius)',
        lg: 'var(--radius)',
        xl: 'var(--radius)',
        '2xl': 'var(--radius)',
        full: '9999px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'monospace'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
      },
      animation: {
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'hash-scroll': 'hashScroll 20s linear infinite',
        'flicker': 'flicker 8s linear infinite',
        'border-glow': 'borderGlow 4s ease-in-out infinite',
        'slide-up': 'slideInUp 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      backgroundImage: {
        'matrix': 'radial-gradient(ellipse at 20% 20%, rgba(0, 255, 65, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0, 255, 65, 0.03) 0%, transparent 50%)',
        'terminal-gradient': 'linear-gradient(180deg, #000000 0%, #050d05 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(0, 255, 65, 0.3)',
        'glow-md': '0 0 16px rgba(0, 255, 65, 0.4)',
        'glow-lg': '0 0 32px rgba(0, 255, 65, 0.3)',
        'glow-inset': 'inset 0 0 12px rgba(0, 255, 65, 0.05)',
        'terminal': '0 0 8px rgba(0, 255, 65, 0.3), inset 0 0 8px rgba(0, 255, 65, 0.05)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};