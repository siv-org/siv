import { Paper } from '@material-ui/core'
import { countBy, mapValues, orderBy } from 'lodash'
import { useMemo } from 'react'

import { candidates, voters } from './election-parameters'
import { generateSecretID } from './secret-id'
import { useVoteContext } from './vote-context'

export function Unlocked(): JSX.Element {
  const { state } = useVoteContext()

  const randomCandidate = () => candidates[Math.floor(Math.random() * candidates.length)]

  const votes = useMemo(
    () => [
      ...voters.slice(1).map(() => ({ secret: generateSecretID(), vote_for_mayor: randomCandidate() })),
      state.plaintext,
    ],
    [voters],
  )

  const vote_counts = countBy(votes.map((v) => v.vote_for_mayor))
  const tuples = mapValues(vote_counts, (votes, name) => ({ name, votes }))
  const ordered = orderBy(tuples, 'votes', 'desc')

  return (
    <>
      <Paper elevation={3} style={{ overflowWrap: 'break-word', padding: 15 }}>
        <code>
          {votes.map(({ secret, vote_for_mayor }) => (
            <p key={secret}>{`{ secret: '${secret}', vote_for_mayor: '${vote_for_mayor}' }'`}</p>
          ))}
        </code>
      </Paper>
      <Paper elevation={3} style={{ marginTop: 30, overflowWrap: 'break-word', padding: 15 }}>
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
