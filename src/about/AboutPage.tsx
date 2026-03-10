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
