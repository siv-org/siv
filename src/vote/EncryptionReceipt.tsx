import { NoSsr } from '@material-ui/core'
import { map } from 'lodash-es'

import { Paper } from '../protocol/Paper'
import { State } from './vote-state'

export function EncryptionReceipt({ state }: { state: State & { submitted_at: Date } }): JSX.Element {
  return (
    <NoSsr>
      <p>
        Your secret Tracking #: <b>{state.tracking}</b>
        <br />
        <em>Use this to verify your vote was counted correctly.</em>
      </p>
      <br />
      <p>Your Private Encryption Receipt:</p>
      <Paper noFade style={{ padding: '1.5rem' }}>
        <code>
          {`Submitted @ ${new Date(state.submitted_at)}

Encryption Formula
  https://en.wikipedia.org/wiki/ElGamal_encryption
  encrypted = encoded * (recipient ^ randomizer) % modulo
  unlock = (generator ^ randomizer) % modulo

Public Key
  ${map(state.public_key, (v, k) => `${k}: ${v}`).join('\n  ')}

YOUR VOTE DATA:

Your secret tracking number: ${state.tracking}

${Object.keys(state.plaintext)
  .map(
    (key) => `${key}
  plaintext: ${state.tracking}:${state.plaintext[key]}
  encoded: ${state.encoded[key]}
  randomizer: ${state.randomizer[key]}
    encrypted: ${state.encrypted[key].encrypted}
    unlock: ${state.encrypted[key].unlock}
`,
  )
  .join('\n')}`}
        </code>
      </Paper>

      <style jsx>{`
        em {
          font-size: 12px;
        }

        code {
          font-size: 11px;
          max-width: 100%;
          white-space: pre-wrap;
        }
      `}</style>
    </NoSsr>
  )
}
