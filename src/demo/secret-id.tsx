import { Button, Paper, TextField } from '@material-ui/core'
import { useEffect } from 'react'

import { useContext } from '../context'

export default function SecretID(): JSX.Element {
  const { dispatch, state } = useContext()

  const generate = () => {
    dispatch({ secret: generateSecretID() })
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
          Secret Identifier:
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            inputProps={{ style: { fontFamily: 'monospace', fontSize: 15 } }}
            label=""
            size="small"
            style={{ backgroundColor: '#fff8' }}
            value={state.secret}
            variant="outlined"
          />
          <Button color="primary" onClick={generate}>
            Regenerate
          </Button>
        </div>
        <p>
          <b>This Secret Identifier will be shown once ballots are unsealed.</b> It allows you to easily verify your
          vote was counted correctly, while protecting your privacy.
        </p>
        <p style={{ fontSize: 12 }}>
          This unique value was generated on your own device. Don&apos;t share it with anyone, or they&apos;ll be able
          to see how you voted.
        </p>
        <p style={{ fontSize: 12 }}>You can regenerate a new one if needed.</p>
      </Paper>
    </>
  )
}

export function generateSecretID() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const id = `${hex.slice(0, 4)} ${hex.slice(4, 8)} ${hex.slice(8, 12)}`
  return id
}
