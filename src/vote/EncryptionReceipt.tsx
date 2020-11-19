import { NoSsr } from '@material-ui/core'
import { map } from 'lodash-es'

import { encode } from '../crypto/encode'
import encrypt from '../crypto/encrypt'
import { public_key } from '../protocol/election-parameters'
import { Paper } from '../protocol/Paper'

type Map = Record<string, string>
export function EncryptionReceipt({
  state,
}: {
  state: { encrypted: Record<string, ReturnType<typeof encrypt>>; plaintext: Map; randomizer: Map }
}): JSX.Element {
  return (
    <NoSsr>
      <Paper>
        <code>
          {`
ENCRYPTION RECEIPT - Save this for Verification

Encrypted @ ${new Date().toString()}

Encryption Formula
  message = encoded * (recipient ^ randomizer) % modulo
  unlock = (generator ^ randomizer) % modulo

Public Key
  ${map(public_key, (v, k) => `${k}: ${v.toString()}`).join('\n  ')}

${Object.keys(state.plaintext)
  .map(
    (key) => `${key}
  plaintext: ${state.plaintext[key]}
  encoded: ${/*encode(state.plaintext[key] as string)*/ ''}
  randomizer: ${state.randomizer[key]}
    encrypted: ${state.encrypted[key].encrypted}
    unlock: ${state.encrypted[key].unlock}
`,
  )
  .join('\n')}
`}
        </code>
      </Paper>

      <style jsx>{`
        code {
          font-size: 11px;
          max-width: 100%;
          white-space: pre-wrap;
        }
      `}</style>
    </NoSsr>
  )
}
