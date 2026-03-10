import { Inter, JetBrains_Mono, Libre_Baskerville } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
  weight: ['400', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
})

export const homepage2026FontClass = [
  inter.variable,
  libreBaskerville.variable,
  jetbrainsMono.variable,
  inter.className,
].join(' ')
