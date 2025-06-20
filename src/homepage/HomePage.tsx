import { GlobalCSS } from 'src/GlobalCSS'
import { useAnalytics } from 'src/useAnalytics'

import { Head } from '../Head'
import { AboveFold } from './AboveFold'
import { AnAdditionalOption } from './AnAdditionalOption'
import { AreYouAVoter } from './AreYouAVoter'
import { Features } from './Features'
import { Footer } from './Footer'
import { NowPossible } from './NowPossible'
import { OnePersonOneVote } from './OnePersonOneVote'
import { Privacy } from './Privacy'
import { Verifiability } from './Verifiability'

export const HomePage = () => {
  useAnalytics()
  return (
    <>
      <Head title="Secure Internet Voting" />

      <div>
        <AboveFold />
        <Features />
        <Privacy />
        <OnePersonOneVote />
        <Verifiability />
        <AnAdditionalOption />
        <NowPossible />
        <AreYouAVoter />
        <Footer />

        <GlobalCSS />
      </div>
      <style jsx>{`
        div {
          padding: 1rem 3rem;
          padding-top: 0 !important;

          width: 100%;
          overflow-x: hidden;
        }

        /* For small screens */
        @media (max-width: 700px) {
          div {
            padding: 1rem 2rem;
          }
        }
      `}</style>
    </>
  )
}
