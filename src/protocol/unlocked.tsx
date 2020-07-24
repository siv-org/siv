import { Paper } from '@material-ui/core'
import { countBy, mapValues, orderBy } from 'lodash'

import { useContext } from '../context'
import { candidates, voters } from './election-parameters'
import { generateSecretID } from './secret-id'

export default function Unlocked(): JSX.Element {
  const { state } = useContext()

  const votes = [
    ...voters.slice(1).map(() => candidates[Math.floor(Math.random() * candidates.length)]),
    state.plaintext.vote_for_mayor,
  ]
  const vote_counts = countBy(votes)
  const tuples = mapValues(vote_counts, (votes, name) => ({ name, votes }))
  const ordered = orderBy(tuples, 'votes', 'desc')

  return (
    <>
      <Paper elevation={3} style={{ overflowWrap: 'break-word', padding: 15 }}>
        <code>
          {voters.slice(1).map((_, index) => (
            <p key={index}>{`{ secret: '${generateSecretID()}', vote_for_mayor: '${votes[index]}' }'`}</p>
          ))}
          <p>{`{ secret: '${state.plaintext.secret}', vote_for_mayor: '${state.plaintext.vote_for_mayor}' }`}</p>
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
