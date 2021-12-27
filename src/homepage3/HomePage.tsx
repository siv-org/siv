import { AboveFold } from './AboveFold'
import { AnAdditionOption } from './AnAdditionalOption'
import { Features } from './Features'
import { NowPossible } from './NowPossible'
import { OnePersonOneVote } from './OnePersonOneVote'
import { Privacy } from './Privacy'
import { Verifiability } from './Verifiability'

export const HomePage = () => (
  <p>
    <AboveFold />
    <Features />
    <Privacy />
    <OnePersonOneVote />
    <Verifiability />
    <AnAdditionOption />
    <NowPossible />
  </p>
)
