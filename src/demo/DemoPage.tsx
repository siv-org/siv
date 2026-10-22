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
    <div className={`demo-page overflow-x-hidden min-h-screen antialiased ${h26fonts} bg-h26-bg text-h26-text`}>
      <Head title="SIV Interactive Demo" />
      <div className="relative z-10">
        <Nav />
        <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-[100px] sm:px-7 sm:pb-20 sm:pt-[120px]">
          <InteractiveDemo />
        </main>
        <Footer />
      </div>
      <TailwindPreflight />
      <style jsx>{`
        .demo-page {
          --h26-bg: 245 245 239;
          --h26-border: 32 57 46;
          --h26-green: 33 92 66;
          --h26-green-hover: 22 62 45;
          --h26-muted: 129 144 126;
          --h26-text: 32 57 46;
          --h26-text-secondary: 97 113 102;
        }
      `}</style>
    </div>
  )
}
