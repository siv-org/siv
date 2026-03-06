import { useEffect } from 'react'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { ClosingCta } from './ClosingCta'
import { homepage2026FontClass } from './fonts'
import { Footer } from './Footer'
import { Hero } from './Hero'
import { Highlights } from './highlights/Highlights'
import { Nav } from './Nav'
import { NewsSection } from './NewsSection'
import { Properties } from './Properties'

export function Homepage2026() {
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = prev
    }
  }, [])

  return (
    <div className={`overflow-x-hidden min-h-screen antialiased bg-h2026-bg text-h2026-text ${homepage2026FontClass}`}>
      {/* Ambient orb */}
      <div
        className="pointer-events-none fixed z-0 sm:h-[700px] sm:w-[700px] h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(26,107,74,0.3), transparent 70%)',
          right: -200,
          top: -100,
        }}
      />

      <div className="relative z-10">
        <Nav />
        <Hero />
        <NewsSection />
        <Properties />
        <Highlights />
        <ClosingCta />
        <Footer />
      </div>

      <TailwindPreflight />
    </div>
  )
}
