import { GlobalCSS } from 'src/GlobalCSS'
import { useAnalytics } from 'src/useAnalytics'

import { Head } from '../Head'
import { Footer } from '../homepage/Footer'
import { HeaderBar } from '../homepage/HeaderBar'
import { CompareTable } from './CompareTable'

export const ComparePage = (): JSX.Element => {
  useAnalytics()
  return (
    <>
      <Head title="Voting Methods Compared" />

      <div>
        <HeaderBar />
      </div>
      <CompareTable />
      <div>
        <Footer />
      </div>

      <GlobalCSS />

      <style jsx>{`
        div {
          padding: 1rem 3rem;

          width: 100%;
          overflow-x: hidden;
        }

        @media (max-width: 700px) {
          div {
            padding: 1rem 1.5rem;
          }
        }
      `}</style>
    </>
  )
}
