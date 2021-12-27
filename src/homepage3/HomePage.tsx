import { GlobalCSS } from 'src/GlobalCSS'

import { AboveFold } from './AboveFold'
import { AnAdditionalOption } from './AnAdditionalOption'
import { Features } from './Features'
import { Footer } from './Footer'
import { LetYourGovtKnow } from './LetYourGovtKnow'
import { NowPossible } from './NowPossible'
import { OnePersonOneVote } from './OnePersonOneVote'
import { Privacy } from './Privacy'
import { Verifiability } from './Verifiability'

export const HomePage = () => (
  <div>
    <AboveFold />
    <Features />
    <Privacy />
    <OnePersonOneVote />
    <Verifiability />
    <AnAdditionalOption />
    <NowPossible />
    <LetYourGovtKnow />
    <Footer />

    <GlobalCSS />
    <style jsx>{`
      div {
        padding: 1rem 3rem;
      }
    `}</style>
  </div>
)
