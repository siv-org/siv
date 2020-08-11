import { Button, NoSsr, Paper, TextField } from '@material-ui/core'
import { useEffect } from 'react'

import { useWindowDimensions } from './useWindowDimensions'
import { useVoteContext } from './VoteContext'

export function VerificationSecret(): JSX.Element {
  const { dispatch, state } = useVoteContext()
  const { width } = useWindowDimensions()

  const generate = () => {
    dispatch({ secret: generateVerificationSecret() })
  }

  useEffect(generate, [])

  return (
    <>
      <Paper elevation={3} style={{ marginBottom: 30, padding: '0.5rem 1.5rem' }}>
        <p
          style={{
            backgroundColor: '#e6eafb',
            fontWeight: 'bold',
            marginBottom: 10,
            padding: '5px 13px',
          }}
        >
          Verification Secret:
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <NoSsr>
            <TextField
              inputProps={{ style: { fontFamily: 'monospace', fontSize: 15 } }}
              label=""
              size="small"
              style={{ backgroundColor: '#fff8' }}
              value={state.plaintext.secret}
              variant="outlined"
            />
            <Button color="primary" onClick={generate}>
              {width < 450 ? 'Regen' : 'Regenerate'}
            </Button>
          </NoSsr>
        </div>
        <p>
          <b>This Verification Secret will be shown once votes are unlocked.</b> It allows you to easily verify your
          vote was counted correctly, while protecting your privacy.
        </p>
        <p style={{ fontSize: 12 }}>
          This unique value was generated on your own device. Don&apos;t share it with anyone, or they&apos;ll be able
          to see how you voted. Regenerate if needed.
        </p>
      </Paper>
    </>
  )
}

export function generateVerificationSecret() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const id = `${hex.slice(0, 4)} ${hex.slice(4, 8)} ${hex.slice(8, 12)}`
  return id
}
