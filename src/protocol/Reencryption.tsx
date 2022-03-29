import { useEffect, useReducer } from 'react'

import { Paper } from './Paper'
import { AuthedVote, randEncrypted, useVoteContext } from './VoteContext'

let interval: ReturnType<typeof setInterval>

export function Reencryption(): JSX.Element {
  const { state } = useVoteContext()

  const init = { counter: 0, votes: [...state.otherSubmittedVotes, state.otherSubmittedVotes[2]] }

  // Put mutation logic in reducer to access prev values
  const [{ counter, votes }, dispatch] = useReducer((prev: typeof init): typeof init => {
    // Which field's turn is it to update?
    const { counter } = prev

    // Update only that field
    const newVotes = [...prev.votes]
    newVotes[counter] = { ...newVotes[counter], mayor_vote: randEncrypted() }

    return {
      // Reset counter when it hits the end
      counter: counter == 4 ? 0 : counter + 1,
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
            <HighlightDiff {...{ counter, index, vote }} field="mayor_vote" />
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
  vote: Partial<AuthedVote>
}) => {
  const prevVote = counter === 0 ? 4 : counter - 1
  return (
    <>
      {field}: <span className={prevVote === index ? 'highlight' : ''}>{vote[field]}</span>
      <style jsx>{`
        .highlight {
          color: #9013fe;
        }
      `}</style>
    </>
  )
}
