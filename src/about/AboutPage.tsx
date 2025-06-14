import { GlobalCSS } from 'src/GlobalCSS'
import { useAnalytics } from 'src/useAnalytics'

import { Head } from '../Head'
import { Footer } from '../homepage/Footer'
import { AboveFold } from './AboveFold'
import { Content } from './Content'

export const AboutPage = (): JSX.Element => {
  useAnalytics()
  return (
    <>
      <Head title="About" />

      <div>
        <AboveFold />
        <a id="research" />
        <Content />
        <Footer />
      </div>

      <GlobalCSS />

      <style jsx>{`
        div {
          padding: 1rem 3rem;
          padding-top: 0 !important;

          width: 100%;
          overflow-x: hidden;
        }

        @media (max-width: 700px) {
          div {
            padding: 1rem 2rem;
          }
        }
      `}</style>
    </>
  )
}
