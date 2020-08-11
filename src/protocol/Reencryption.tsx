import { useEffect, useReducer } from 'react'

import { Paper } from './Paper'
import { VoteWithToken, randEncrypted, useVoteContext } from './VoteContext'

let interval: ReturnType<typeof setInterval>

export function Reencryption(): JSX.Element {
  const { state } = useVoteContext()

  const init = { counter: 0, votes: [...state.otherSubmittedVotes, { ...state.encrypted }] }

  // Put mutation logic in reducer to access prev values
  const [{ counter, votes }, dispatch] = useReducer((prev: typeof init): typeof init => {
    // Which field's turn is it to update?
    const { nextField, nextVote } = calcNext(prev.counter)

    // Update only that field
    const newVotes = [...prev.votes]
    newVotes[nextVote][nextField] = randEncrypted()

    return {
      // Reset counter when it hits the end
      counter: prev.counter < 9 ? prev.counter + 1 : 0,
      votes: newVotes,
    }
  }, init)

  // Activate our mutation reducer on an interval
  useEffect(() => {
    interval = setInterval(dispatch, 750)
    return () => clearInterval(interval)
  }, [])

  return (
    <Paper>
      <code>
        {votes.map((vote, index) => (
          <p key={index}>
            {`{`}
            <HighlightDiff {...{ counter, index, vote }} field="secret" />,
            <HighlightDiff {...{ counter, index, vote }} field="vote_for_mayor" />
            {' }'}
          </p>
        ))}
      </code>
    </Paper>
  )
}

const HighlightDiff = ({
  counter,
  field,
  index,
  vote,
}: {
  counter: number
  field: string
  index: number
  vote: Partial<VoteWithToken>
}) => {
  const { nextField, nextVote } = calcNext(counter === 0 ? 9 : counter - 1)
  return (
    <>
      {' '}
      {field}: <span className={nextField === field && nextVote === index ? 'highlight' : ''}>{vote[field]}</span>
      <style jsx>{`
        .highlight {
          color: #9013fe;
        }
      `}</style>
    </>
  )
}

const calcNext = (counter: number) => ({
  nextField: counter % 2 ? 'vote_for_mayor' : 'secret',
  nextVote: Math.floor(counter / 2),
})
