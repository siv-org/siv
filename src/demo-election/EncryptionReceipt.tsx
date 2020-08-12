import { NoSsr } from '@material-ui/core'
import { map } from 'lodash'

import { encode } from '../protocol/crypto/encode'
import { public_key } from '../protocol/election-parameters'
import { Paper } from '../protocol/Paper'

type Ballot = { [index: string]: string; best_icecream: string; secret: string }
export function EncryptionReceipt({
  state,
}: {
  state: { encrypted: Ballot; plaintext: Ballot; randomizer: Ballot }
}): JSX.Element {
  return (
    <NoSsr>
      <Paper>
        <code>
          {`
Encrypted @ ${new Date().toString()}

Encryption Formula
  sealed_data = encoded * (sealing_target ^ randomizer) % modulo
  sealing_factor = (generator ^ randomizer) % modulo

Public Key
  ${map(public_key, (v, k) => `${k}: ${v.toString()}`).join('\n  ')}


${map(
  state.plaintext,
  (_, key) => `${key}
  plaintext: ${state.plaintext[key]}
  encoded: ${encode(state.plaintext[key] as string)}
  randomizer: ${state.randomizer[key]}
  encrypted ${state.encrypted[key]?.slice(1, -1)}
`,
).join('\n')}
`}
        </code>
      </Paper>

      <style jsx>{`
        code {
          font-size: 11px;
          max-width: 100%;
          white-space: pre-wrap;
          tab-size: 4;
        }
      `}</style>
    </NoSsr>
  )
}
