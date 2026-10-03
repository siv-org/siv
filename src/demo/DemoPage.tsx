import Link from 'next/link'
import { Head } from '../Head'
import { h26fonts } from '../homepage2026/fonts'
import { Footer } from '../homepage/Footer'
import { HeaderBar } from '../homepage/HeaderBar'
import { TailwindPreflight } from '../TailwindPreflight'
import { useAnalytics } from '../useAnalytics'
import { InteractiveDemo } from './InteractiveDemo'

export const DemoPage = (): JSX.Element => {
  useAnalytics()
  return (
    <>
      <Head title="SIV Interactive Demo" />
      <div className={`${h26fonts} min-h-screen overflow-x-hidden bg-h26-bg text-h26-text antialiased`}>
        <div className="px-4 sm:px-7">
          <HeaderBar />
        </div>
        <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-6 sm:px-7 sm:pb-20 sm:pt-12">
          <div className="mb-5 sm:mb-6">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Prototype — vote through SIV’s defenses end-to-end.{' '}
              <Link
                className="font-medium text-h26-green no-underline underline-offset-2 hover:underline"
                href="/protocol"
              >
                Prefer the illustrated protocol?
              </Link>
            </p>
          </div>
          <InteractiveDemo />
        </main>
        <div className="px-4 sm:px-7">
          <Footer />
        </div>
      </div>
      <TailwindPreflight />
    </>
  )
}
