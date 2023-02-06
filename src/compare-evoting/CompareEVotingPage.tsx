import { GlobalCSS } from 'src/GlobalCSS'
import { useAnalytics } from 'src/useAnalytics'

import { Head } from '../Head'
import { Footer } from '../homepage/Footer'
import { HeaderBar } from '../homepage/HeaderBar'
import { ECompareTable } from './ECompareTable'

export const CompareEVotingPage = (): JSX.Element => {
  useAnalytics()
  return (
    <>
      <Head title="Electronic Voting Methods Compared" />

      <div>
        <HeaderBar />
      </div>
      <ECompareTable />
      <div>
        <Footer />
      </div>

      <GlobalCSS />

      <style jsx>{`
        div {
          padding: 1rem 3rem;

          width: 100%;
          overflow: hidden;
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
