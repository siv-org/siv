import { countBy, mapValues, orderBy } from 'lodash'
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
      ...voters.slice(1).map(() => ({ secret: generateVerificationSecret(), vote_for_mayor: randomCandidate() })),
      state.plaintext,
    ],
    [voters],
  )

  const vote_counts = countBy(votes.map((v) => v.vote_for_mayor))
  const tuples = mapValues(vote_counts, (votes, name) => ({ name, votes }))
  const ordered = orderBy(tuples, 'votes', 'desc')

  return (
    <>
      <Paper noFade>
        <code>
          {votes.map(({ secret, vote_for_mayor }) => (
            <p key={secret}>{`{ secret: '${secret}', vote_for_mayor: '${vote_for_mayor}' }'`}</p>
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
