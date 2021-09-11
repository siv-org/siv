import { Button, NoSsr, TextField } from '@material-ui/core'
import { useEffect } from 'react'

import { generateTrackingNum } from '../vote/tracking-num'
import { Paper } from './Paper'
import { useWindowDimensions } from './useWindowDimensions'
import { useVoteContext } from './VoteContext'

export function VerificationSecret(): JSX.Element {
  const { dispatch, state } = useVoteContext()
  const { width } = useWindowDimensions()

  const generate = () => {
    dispatch({ verification: generateTrackingNum() })
  }

  useEffect(generate, [])

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
              value={state.plaintext.verification}
              variant="outlined"
            />
            <Button color="primary" onClick={generate}>
              {width < 450 ? 'Regen' : 'Regenerate'}
            </Button>
          </NoSsr>
        </div>
        <p>
          <b>This Verification # will be shown once votes are unlocked.</b> It allows you to easily verify your vote was
          counted correctly, while protecting your privacy.
        </p>
        <p style={{ fontSize: 12 }}>
          This unique value was generated on your own device. Don&apos;t share it with anyone.
        </p>
      </Paper>
    </>
  )
}
