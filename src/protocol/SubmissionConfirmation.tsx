import { Paper } from './Paper'
import { useVoteContext } from './VoteContext'

export const SubmissionConfirmation = () => {
  const { mayor_vote, token, verification } = useVoteContext().state.encrypted
  return (
    <Paper marginBottom noFade style={{ position: 'relative' }}>
      <img
        src="/protocol/step-1-invitation-icon.png"
        style={{ maxWidth: 35, opacity: 0.5, position: 'absolute', right: 'calc(1vw + 5px)', width: '7vw' }}
      />
      <p>
        From: <b>elections@local.gov</b> <br />
        To: <b>you@email.com</b> <br />
        Subject: <b>Vote for Mayor Confirmation</b>
      </p>
      <p>Your vote for mayor has been received. Thank you.</p>
      <p>
        The final results will be posted at <a style={{ cursor: 'pointer' }}>www.local.gov/2020-election-results</a>{' '}
        when the election closes.
      </p>
      <p>Here is the encrypted vote you submitted:</p>
      <code style={{ display: 'block', lineHeight: '16px', padding: '0 6%' }}>
        {`{`} token: &apos;{token}&apos;, mayor_vote: {mayor_vote}, verification: {verification} {`}`}
      </code>
      <p>
        <i style={{ fontSize: 12 }}>
          If you did not submit this ballot, <a style={{ cursor: 'pointer' }}>click here</a> to report a problem.
        </i>
      </p>
    </Paper>
  )
}
