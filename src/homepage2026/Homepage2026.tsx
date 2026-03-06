import { useEffect } from 'react'

import { homepage2026FontClass } from './fonts'
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
        <div className="mx-auto max-w-[1060px] px-7">
          <div className="my-5 h-px bg-h2026-border md:my-10" />
        </div>
        <footer className="py-7 text-center border-t border-h2026-border">
          <div className="mx-auto max-w-[1060px] px-7">
            <p className="text-[0.75rem] font-light text-h2026-muted">© 2020-2026 SIV. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
