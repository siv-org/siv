import { shuffle } from 'lodash-es'
import { useEffect, useState } from 'react'
import FlipMove from 'react-flip-move'

import { Paper } from './Paper'
import { useVoteContext } from './VoteContext'

let interval: ReturnType<typeof setInterval>

export function ShuffleVotes(): JSX.Element {
  const { state } = useVoteContext()
  const [votes, setVotes] = useState([...state.otherSubmittedVotes, state.encrypted])

  useEffect(() => {
    interval = setInterval(() => {
      setVotes(shuffle(votes))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Paper>
      <code>
        <FlipMove>
          {votes.map(({ auth, mayor_vote, verification }) => (
            <p key={auth}>
              {`{`} mayor_vote: {mayor_vote}, verification: {verification} {'}'}
            </p>
          ))}
        </FlipMove>
      </code>
    </Paper>
  )
}
