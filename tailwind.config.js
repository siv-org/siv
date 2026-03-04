/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx', './pages/**/*.tsx'],
  corePlugins: { preflight: false },
  plugins: [],
  theme: {
    extend: {
      animation: {
        'orb-1': 'orbFloat 30s ease-in-out infinite alternate',
        'orb-2': 'orbFloat 25s ease-in-out infinite alternate-reverse',
      },
      borderRadius: {
        h2026: '14px',
        'h2026-lg': '20px',
      },
      boxShadow: {
        'h2026-cta': '0 4px 20px rgba(26,107,74,0.25)',
        'h2026-cta-hover': '0 8px 35px rgba(26,107,74,0.3)',
        'h2026-lg': '0 20px 60px rgba(0,0,0,0.08)',
        'h2026-md': '0 8px 30px rgba(0,0,0,0.06)',
        'h2026-sm': '0 1px 3px rgba(0,0,0,0.04)',
      },
      colors: {
        h2026: {
          bg: '#fafaf9',
          bgCard: '#ffffff',
          bgWarm: '#f5f4f0',
          blue: '#1e3a5f',
          border: 'rgba(0,0,0,0.06)',
          borderStrong: 'rgba(0,0,0,0.1)',
          dark: '#1a1a1a',
          green: '#1a6b4a',
          greenHover: '#155a3e',
          muted: '#999999',
          purple: '#7c3aed',
          text: '#1a1a1a',
          textSecondary: '#6b6b6b',
        },
      },
      fontFamily: {
        mono2026: ['var(--font-jetbrains-mono)', 'monospace'],
        serif2026: ['var(--font-libre-baskerville)', 'Georgia', 'serif'],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        orbFloat: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(40px, -30px)' },
        },
      },
    },
  },
}
