import Link from 'next/link'

import { ScrollReveal } from '../homepage2026/ScrollReveal'

export const AboutHeader = () => (
  <section className="mx-auto max-w-[1060px] mb-12 pt-[120px] md:pt-[150px]">
    <ScrollReveal>
      {/* Floating green panel: matches homepage Highlights section */}
      <div
        className="rounded-[24px] bg-h26-green/[0.06] px-6 py-12 text-center md:px-10 md:py-16"
        style={{ boxShadow: '0 4px 20px -8px rgba(26,107,74,0.12), 0 0 0 1px rgba(26,107,74,0.04)' }}
      >
        {/* About SIV Text */}
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          <Link className="font-semibold text-blue-950 hover:underline" href="/">
            SIV.org
          </Link>{' '}
          has been created for citizens of all free governments around the world to be able to quickly, easily, and
          safely be heard.
        </p>
      </div>
    </ScrollReveal>
  </section>
)
