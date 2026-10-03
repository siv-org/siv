import Link from 'next/link'

import { Head } from '../Head'
import { h26fonts } from '../homepage2026/fonts'
import { Footer } from '../homepage2026/Footer'
import { Nav } from '../homepage2026/Nav'
import { TailwindPreflight } from '../TailwindPreflight'
import { useAnalytics } from '../useAnalytics'
import { InteractiveDemo } from './InteractiveDemo'

export const DemoPage = (): JSX.Element => {
  useAnalytics()
  return (
    <div className={`overflow-x-hidden min-h-screen antialiased ${h26fonts} bg-h26-bg text-h26-text`}>
      <Head title="SIV Interactive Demo" />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1100px] px-4 pb-16 pt-[100px] sm:px-7 sm:pb-20 sm:pt-[120px]">
        <div className="mb-5 sm:mb-6">
          <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
            Prototype — vote through SIV’s defenses end-to-end.{' '}
            <Link
              className="font-medium no-underline text-h26-green underline-offset-2 hover:underline"
              href="/protocol"
            >
              Prefer the illustrated protocol?
            </Link>
          </p>
        </div>
        <InteractiveDemo />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <TailwindPreflight />
    </div>
  )
}
