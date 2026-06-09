import Link from 'next/link'

import { ScrollReveal } from '../homepage2026/ScrollReveal'

export const AboutHeader = () => (
  <ScrollReveal>
    <section className="px-6 mx-auto max-w-4xl mb-12 pt-[120px] text-center md:pt-[150px]">
      <p className="mx-auto max-w-2xl text-lg text-gray-600">
        <Link className="font-semibold hover:underline" href="/">
          SIV.org
        </Link>{' '}
        has been created for citizens of all free governments around the world to be able to quickly, easily, and safely
        be heard.
      </p>
    </section>
  </ScrollReveal>
)
