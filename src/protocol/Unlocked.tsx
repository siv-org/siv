import { countBy, mapValues, orderBy } from 'lodash-es'
import { useMemo } from 'react'

import { candidates, voters } from './election-parameters'
import { Paper } from './Paper'
import { generateVerificationSecret } from './VerificationSecret'
import { useVoteContext } from './VoteContext'

export function Unlocked(): JSX.Element {
  const { state } = useVoteContext()

  const randomCandidate = () => candidates[Math.floor(Math.random() * candidates.length)]

  const votes = useMemo(
    () => [
      ...voters.slice(1).map(() => ({ mayor_vote: randomCandidate(), verification: generateVerificationSecret() })),
      state.plaintext,
    ],
    [voters],
  )

  const vote_counts = countBy(votes.map((v) => v.mayor_vote))
  const tuples = mapValues(vote_counts, (votes, name) => ({ name, votes }))
  const ordered = orderBy(tuples, 'votes', 'desc')

  return (
    <>
      <Paper noFade>
        <code>
          {votes.map(({ mayor_vote, verification }) => (
            <p key={verification}>{`{ mayor_vote: '${mayor_vote}', verification: '${verification}' }`}</p>
          ))}
        </code>
        <br />
        <b>Final results:</b>
        <ol>
          {ordered.map(({ name, votes }) => (
            <li key={name}>
              {name}: {votes}
            </li>
          ))}
        </ol>
      </Paper>
    </>
  )
}
