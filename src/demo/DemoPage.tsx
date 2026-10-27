import { Head } from '../Head'
import { h26fonts } from '../homepage2026/fonts'
import { Footer } from '../homepage2026/Footer'
import { Nav } from '../homepage2026/Nav'
import { TailwindPreflight } from '../TailwindPreflight'
import { useAnalytics } from '../useAnalytics'
import { InteractiveDemo } from './interactiveDemo/InteractiveDemo'

export const DemoPage = (): JSX.Element => {
  useAnalytics()
  return (
    <div className={`overflow-x-hidden min-h-screen antialiased ${h26fonts} bg-h26-bg text-h26-text`}>
      <Head title="SIV Demo" />
      <div className="relative z-10">
        <Nav fixed={false} />
        <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-[100px] sm:px-7 sm:pb-20 sm:pt-[120px]">
          <InteractiveDemo />
        </main>
        <Footer />
      </div>
      <TailwindPreflight />
    </div>
  )
}
