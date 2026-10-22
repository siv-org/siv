/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './pages/**/*.tsx'],
  corePlugins: { preflight: false },
  plugins: [],
  theme: {
    extend: {
      boxShadow: {
        'h26-cta': '0 4px 20px rgba(26,107,74,0.25)',
        'h26-cta-hover': '0 8px 35px rgba(26,107,74,0.3)',
        'h26-lg': '0 20px 60px rgba(0,0,0,0.08)',
      },
      colors: {
        h26: {
          bg: 'rgb(var(--h26-bg, 250 250 249) / <alpha-value>)',
          blue: '#1e3a5f',
          border: 'rgb(var(--h26-border, 0 0 0) / 0.06)',
          green: 'rgb(var(--h26-green, 26 107 74) / <alpha-value>)',
          greenHover: 'rgb(var(--h26-green-hover, 21 90 62) / <alpha-value>)',
          muted: 'rgb(var(--h26-muted, 153 153 153) / <alpha-value>)',
          text: 'rgb(var(--h26-text, 26 26 26) / <alpha-value>)',
          textSecondary: 'rgb(var(--h26-text-secondary, 107 107 107) / <alpha-value>)',
        },
      },
      fontFamily: {
        mono26: ['var(--font-jetbrains-mono)', 'monospace'],
        serif26: ['var(--font-libre-baskerville)', 'Georgia', 'serif'],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
