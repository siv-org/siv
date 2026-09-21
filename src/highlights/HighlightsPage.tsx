import { Landmark } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { api } from 'src/api-helper'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'
import { useAnalytics } from 'src/useAnalytics'

import { CompareSection } from '../homepage2026/compare/CompareSection'
import { h26fonts } from '../homepage2026/fonts'
import { Footer } from '../homepage2026/Footer'
import { Nav } from '../homepage2026/Nav'
import { type Section, SECTIONS } from './highlights-data'

export function HighlightsPage() {
  useAnalytics()
  useSectionViews()

  return (
    <div className={`overflow-x-hidden min-h-screen antialiased bg-h26-bg text-h26-text ${h26fonts}`}>
      <Head
        description="How digital voting complements mail and in-person, with cost, time, and auditability benefits."
        title="Highlights"
      />

      <Nav />

      {/* Header */}
      <section className="px-7 pt-[120px] pb-10 md:pt-[150px] md:pb-12 mx-auto max-w-[820px] animate-[fadeInUp_0.8s_ease_both]">
        <p className="font-mono26 mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-h26-muted mt-5">
          <Landmark size={16} />
          SIV Highlights
        </p>
        <h1 className="font-serif26 text-[clamp(1.5rem,3.5vw,2.25rem)] font-normal leading-[1.2] tracking-tight mt-8 mb-0">
          Benefits of safe digital voting
        </h1>
      </section>

      <div className="pb-20 space-y-16 md:pb-28 md:space-y-20">
        {SECTIONS.map((section) =>
          'compare' in section ? (
            <section className="scroll-mt-24" key={section.eyebrow}>
              <p className="px-7 mx-auto max-w-[820px] font-mono26 mb-0 text-xs uppercase tracking-[0.15em] text-h26-muted">
                {section.eyebrow}
              </p>
              {/* ponytail: homepage CompareSection has py-12/24; pull it up so this eyebrow sits close */}
              <div className="-mt-9 sm:-mt-12 md:-mt-20">
                <CompareSection />
              </div>
            </section>
          ) : (
            <div className="px-7 mx-auto max-w-[820px]" key={section.title}>
              <SectionBlock section={section} />
            </div>
          ),
        )}
      </div>

      {/* Back */}
      <section className="px-7 pb-16 text-center">
        <Link
          className="inline-flex items-center gap-2 text-[0.82rem] text-h26-muted no-underline transition-colors hover:text-h26-text mb-4"
          href="/"
        >
          <span>←</span>
          Back to home
        </Link>
      </section>

      <Footer />
      <TailwindPreflight />
    </div>
  )
}

function SectionBlock({ section }: { section: Exclude<Section, { compare: true }> }) {
  return (
    <section className="scroll-mt-24 animate-[fadeInUp_0.8s_0.2s_ease_both]" id={sectionId(section)}>
      <p className="font-mono26 mb-3 text-xs uppercase tracking-[0.15em] text-h26-muted">{section.eyebrow}</p>
      <h2 className="font-serif26 text-[clamp(1.25rem,2.8vw,1.7rem)] font-normal leading-snug tracking-tight mb-5">
        {section.title}
      </h2>

      {section.stats && (
        <div
          className={`grid gap-3 py-5 mb-6 border-y border-h26-border ${
            section.stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {section.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif26 text-[1.35rem] md:text-[1.6rem] tracking-tight text-h26-green">{stat.value}</p>
              <p className="mt-1 font-mono26 text-[0.62rem] uppercase tracking-[0.12em] text-h26-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {section.body && (
        <div className="space-y-4">
          {section.body.map((para) => (
            <p className="max-w-[600px] text-[0.9rem] leading-[1.7] text-h26-textSecondary" key={para}>
              {para}
            </p>
          ))}
        </div>
      )}

      {section.image && (
        <div className="overflow-hidden mt-2 bg-white rounded-xl border shadow-sm border-h26-border">
          <img alt={section.image.alt} className="block w-full" src={section.image.src} />
        </div>
      )}

      {section.example && (
        <div className="mt-6 max-w-[600px] border-l-2 border-h26-green/40 pl-4">
          <h3 className="font-serif26 text-[1.05rem] leading-snug mb-2">Example: {section.example.title}</h3>
          <p className="text-[0.9rem] leading-[1.7] text-h26-textSecondary">{section.example.body}</p>
        </div>
      )}

      {section.cite && (
        <a
          className="mt-4 inline-block text-[0.78rem] text-h26-muted no-underline transition-colors hover:text-h26-text"
          href={section.cite}
          rel="noreferrer"
          target="_blank"
        >
          {section.cite.replace(/^https:\/\//, '')} →
        </a>
      )}
    </section>
  )
}

function sectionId(section: { title: string }) {
  return section.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** First time a section enters view → analytics row with that hash (reuse existing table). */
function useSectionViews() {
  useEffect(() => {
    const ids = SECTIONS.map((s) => ('compare' in s ? 'compare' : sectionId(s)))
    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (!id || seen.has(id)) continue
          seen.add(id)
          api('load', {
            hash: `#${id}`,
            height: window.innerHeight,
            referrer: document.referrer || undefined,
            width: window.innerWidth,
          })
        }
      },
      { threshold: 0.45 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])
}
