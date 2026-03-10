import { Library } from 'lucide-react'
import Link from 'next/link'
import { Head } from 'src/Head'

import { h26fonts } from '../fonts'
import { Footer } from '../Footer'
import { Nav } from '../Nav'
import { ResourceCard } from './ResourceCard'
import { RESOURCES } from './resources-data'

export function ResourcesPage() {
  return (
    <div className={`overflow-x-hidden min-h-screen antialiased bg-h2026-bg text-h2026-text ${h26fonts}`}>
      <Head title="Learn How SIV Works" />

      <Nav />

      {/* Ambient orbs */}
      <>
        <div
          className="pointer-events-none fixed z-0 h-[600px] w-[600px] rounded-full opacity-45 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)',
            right: -100,
            top: -200,
          }}
        />
        <div
          className="pointer-events-none fixed z-0 h-[500px] w-[500px] rounded-full opacity-45 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)',
            bottom: '5%',
            left: -150,
          }}
        />
      </>

      {/* Header */}
      <section className="px-7 pt-[120px] pb-10 text-center md:pt-[150px] md:pb-14 mx-auto max-w-[1060px] animate-[fadeInUp_0.8s_ease_both]">
        <p className="font-mono26 mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] text-h2026-muted">
          <Library size={16} />
          Resources
        </p>
        <h1 className="font-serif26 text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.25] tracking-tight">
          Learn How SIV Works
        </h1>
        <p className="mx-auto mt-4 max-w-[520px] text-[0.88rem] leading-[1.7] text-h2026-textSecondary animate-[fadeInUp_0.8s_0.15s_ease_both]">
          From high-level illustrations to formal specifications — everything you need to understand secure internet
          voting.
        </p>
      </section>

      {/* Resource cards */}
      <section className="px-7 pb-20 md:pb-28 mx-auto max-w-[1060px]">
        <div className="grid gap-4 sm:grid-cols-2 animate-[fadeInUp_0.8s_0.3s_ease_both]">
          {RESOURCES.map((resource) => (
            <ResourceCard key={resource.title} {...resource} />
          ))}
        </div>
      </section>

      {/* Back to home */}
      <section className="px-7 pb-16 text-center">
        <Link
          className="inline-flex items-center gap-2 text-[0.82rem] text-h2026-muted no-underline transition-colors hover:text-h2026-text"
          href="/"
        >
          <span>←</span>
          Back to home
        </Link>
      </section>

      <Footer />
    </div>
  )
}
