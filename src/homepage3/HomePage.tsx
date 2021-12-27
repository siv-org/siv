import { AboveFold } from './AboveFold'
import { Features } from './Features'
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
  </p>
)
