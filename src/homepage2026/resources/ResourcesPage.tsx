import { Library } from 'lucide-react'
import Link from 'next/link'

import { homepage2026FontClass } from '../fonts'
import { Nav } from '../Nav'
import { ResourceCard } from './ResourceCard'
import { RESOURCES } from './resources-data'

export function ResourcesPage() {
  return (
    <div className={`min-h-screen overflow-x-hidden antialiased bg-h2026-bg text-h2026-text ${homepage2026FontClass}`}>
      {/* Ambient orbs */}
      <div
        className="pointer-events-none fixed z-0 h-[600px] w-[600px] rounded-full opacity-45 blur-[120px] animate-orb-1"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.07), transparent 70%)',
          right: -100,
          top: -200,
        }}
      />
      <div
        className="pointer-events-none fixed z-0 h-[500px] w-[500px] rounded-full opacity-45 blur-[120px] animate-orb-2"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.05), transparent 70%)',
          bottom: '10%',
          left: -150,
        }}
      />

      <div className="relative z-10">
        <Nav />

        {/* Header */}
        <section className="px-7 pt-[120px] pb-10 text-center md:pt-[150px] md:pb-14">
          <div className="mx-auto max-w-[1060px]">
            <div className="animate-[fadeInUp_0.8s_ease_both]">
              <p className="font-mono2026 mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] text-h2026-muted">
                <Library size={16} />
                Resources
              </p>
              <h1 className="font-serif2026 text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.25] tracking-tight">
                Learn How SIV Works
              </h1>
              <p className="mx-auto mt-4 max-w-[520px] text-[0.88rem] leading-[1.7] text-h2026-textSecondary animate-[fadeInUp_0.8s_0.15s_ease_both]">
                From high-level illustrations to formal specifications — everything you need to understand secure internet voting.
              </p>
            </div>
          </div>
        </section>

        {/* Resource cards */}
        <section className="px-7 pb-20 md:pb-28">
          <div className="mx-auto max-w-[1060px]">
            <div className="grid gap-4 sm:grid-cols-2 animate-[fadeInUp_0.8s_0.3s_ease_both]">
              {RESOURCES.map((resource) => (
                <ResourceCard key={resource.title} {...resource} />
              ))}
            </div>
          </div>
        </section>

        {/* Back to home */}
        <section className="px-7 pb-16">
          <div className="mx-auto max-w-[1060px] text-center">
            <Link
              className="inline-flex items-center gap-2 text-[0.82rem] text-h2026-muted no-underline transition-colors hover:text-h2026-text"
              href="/"
            >
              <span>←</span>
              Back to home
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-h2026-border py-7 text-center">
          <div className="mx-auto max-w-[1060px] px-7">
            <p className="text-[0.75rem] font-light text-h2026-muted">© 2020-2026 SIV. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
