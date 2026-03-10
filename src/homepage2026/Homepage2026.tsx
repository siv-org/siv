import { useEffect } from 'react'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { ClosingCta } from './ClosingCta'
import { CompareSection } from './compare/CompareSection'
import { h26fonts } from './fonts'
import { Footer } from './Footer'
import { Hero } from './Hero'
import { Highlights } from './highlights/Highlights'
import { HowItWorks } from './HowItWorks'
import { Nav } from './Nav'
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
    <div className={`overflow-x-hidden min-h-screen antialiased bg-h2026-bg text-h2026-text ${h26fonts}`}>
      <Head title="Digital Democracy" />
      <div className="relative z-10">
        <Nav />
        <Hero />
        <Highlights />
        <Properties />
        <CompareSection />
        <HowItWorks />
        <ClosingCta />
        <Footer />
      </div>

      <TailwindPreflight />
    </div>
  )
}
