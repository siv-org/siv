import { TextField } from '@mui/material'
import { NoSsr } from 'src/_shared/NoSsr'

import { Paper } from './Paper'
import { useVoteContext } from './VoteContext'

export function VerificationSecret(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <>
      <Paper marginBottom noFade>
        <p
          style={{
            backgroundColor: '#e6eafb',
            fontWeight: 'bold',
            marginBottom: 10,
            padding: '5px 13px',
          }}
        >
          Verification #:
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <NoSsr>
            <TextField
              inputProps={{ style: { fontFamily: 'monospace', fontSize: 15 } }}
              label=""
              size="small"
              style={{ backgroundColor: '#fff8' }}
              value={state.verification}
              variant="outlined"
            />
          </NoSsr>
        </div>
        <p>
          <b>This Verification # will be publicly shown once votes are unlocked.</b> It allows you to easily verify your
          vote was counted correctly, while protecting your privacy.
        </p>
        <p style={{ fontSize: 12 }}>
          This unique value was generated on your own device. Don&apos;t share it with anyone.
        </p>
      </Paper>
    </>
  )
}
