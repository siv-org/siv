import { useAnalytics } from 'src/useAnalytics'

import { Head } from '../Head'
import { h26fonts } from '../homepage2026/fonts'
import { Footer } from '../homepage2026/Footer'
import { Nav } from '../homepage2026/Nav'
import { TailwindPreflight } from '../TailwindPreflight'
import { AcademicResearchPapers } from './AcademicResearchPapers'
import { Contributors } from './contributors/Contributors'
import { ResearchHeader } from './ResearchHeader'

export const AboutPage = (): JSX.Element => {
  useAnalytics()
  return (
    <div className={`overflow-x-hidden min-h-screen antialiased bg-h26-bg text-h26-text ${h26fonts}`}>
      <Head title="About" />
      {/* Ambient orbs */}
      <>
        <div
          className="pointer-events-none fixed z-0 h-[600px] w-[600px] rounded-full opacity-45 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.18), transparent 70%)',
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
      <div className="relative z-10">
        <Nav />
        <div className="px-4 py-14 sm:px-6 sm:py-20 md:px-8">
          <Contributors />
          <a id="research" />
          <ResearchHeader />
          <AcademicResearchPapers />
        </div>
        <Footer />
      </div>
      <TailwindPreflight />
    </div>
  )
}
