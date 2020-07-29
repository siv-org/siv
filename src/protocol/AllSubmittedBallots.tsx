import { Paper } from '@material-ui/core'
import { useMemo } from 'react'

import pickRandomInteger from './crypto/pick-random-integer'
import { voters } from './election-parameters'
import { public_key } from './election-parameters'
import { useVoteContext } from './VoteContext'

export function AllSubmittedBallots(): JSX.Element {
  const { state } = useVoteContext()

  // Only calculate dummy data once, instead of every re-render
  const votes = useMemo(
    () =>
      voters
        .slice(1)
        .map(({ token }) => ({ random: [...new Array(4)].map(() => pickRandomInteger(public_key.modulo)), token })),
    [],
  )

  return (
    <Paper elevation={3} style={{ opacity: 0.7, overflowWrap: 'break-word', padding: 15 }}>
      <code>
        {votes.map(({ random, token }) => (
          <p key={token}>
            {`{ token: '${token}', secret: '{ sealed_data: ${random[0]}, sealing_factor: ${random[1]} }', vote_for_mayor: '{ sealed_data: ${random[2]}, sealing_factor: ${random[3]} }'`}
          </p>
        ))}
        <p>
          {`{ token: '${voters[0].token}', secret: '${state.encrypted.secret}', vote_for_mayor: '${state.encrypted.vote_for_mayor}' }`}
        </p>
      </code>
    </Paper>
  )
}
