import { MessageSquareQuote, Vote } from 'lucide-react'
import Link from 'next/link'
import { Head } from 'src/Head'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { h26fonts } from '../homepage2026/fonts'
import { Footer } from '../homepage2026/Footer'
import { Nav } from '../homepage2026/Nav'
import { ElectionRow } from './ElectionRow'
import { ELECTIONS } from './elections-data'
import { QuoteRow } from './QuoteRow'
import { QUOTES } from './quotes-data'

export function CaseStudiesPage() {
  return (
    <div className={`overflow-x-hidden min-h-screen antialiased bg-h26-bg text-h26-text ${h26fonts}`}>
      <Head title="Case Studies" />

      <Nav />

      {/* Ambient orbs */}
      {/* <>
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
      </> */}

      {/* Header */}
      <section className="px-7 pt-[120px] pb-10 md:pt-[150px] md:pb-14 mx-auto max-w-[820px] animate-[fadeInUp_0.8s_ease_both]">
        <p className="font-mono26 mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-h26-muted mt-5">
          <Vote size={16} />
          Digital Elections
        </p>
        <h1 className="font-serif26 text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.15] tracking-tight mt-8 mb-6">
          Case Studies
        </h1>
        <p className="max-w-[560px] text-[0.92rem] leading-[1.7] text-h26-textSecondary animate-[fadeInUp_0.8s_0.15s_ease_both]">
          SIV makes safe digital voting easy for voters and election administrators. And strong enough for high-stakes
          elections, with One-Person-One-Vote, end-to-end verifiable results, and cryptographically private voting.
        </p>
      </section>

      {/* Election list */}
      <section className="px-7 pb-20 md:pb-24 mx-auto max-w-[820px]">
        <ul className="divide-y divide-h26-border border-y border-h26-border animate-[fadeInUp_0.8s_0.2s_ease_both]">
          {ELECTIONS.map((election) => (
            <li key={election.title}>
              <ElectionRow {...election} />
            </li>
          ))}
        </ul>
      </section>

      {/* Quotes header */}
      <section className="px-7 pt-4 pb-8 md:pb-10 mx-auto max-w-[820px]">
        <p className="font-mono26 mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-h26-muted">
          <MessageSquareQuote size={16} />
          Quotes
        </p>

        <p className="max-w-[560px] text-[0.92rem] leading-[1.7] text-h26-textSecondary">
          What organizers and voters say after running digital elections with SIV.
        </p>
      </section>

      {/* Quotes */}
      <section className="px-7 pb-20 md:pb-28 mx-auto max-w-[820px]">
        <ul className="divide-y divide-h26-border border-y border-h26-border">
          {QUOTES.map((quote) => (
            <li key={quote.quote}>
              <QuoteRow {...quote} />
            </li>
          ))}
        </ul>
      </section>

      {/* Back to home */}
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
