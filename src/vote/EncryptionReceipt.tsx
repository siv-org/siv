import { NoSsr } from '@material-ui/core'
import { map } from 'lodash-es'

import { encode } from '../crypto/encode'
import { public_key } from '../protocol/election-parameters'
import { Paper } from '../protocol/Paper'

type Ballot = { [index: string]: string; best_icecream: string }
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
  message = encoded * (recipient ^ randomizer) % modulo
  unlock = (generator ^ randomizer) % modulo

Public Key
  ${map(public_key, (v, k) => `${k}: ${v.toString()}`).join('\n  ')}

${map(
  state.plaintext,
  (_, key) => `${key}
  plaintext: ${state.plaintext[key]}
  encoded: ${encode(state.plaintext[key] as string)}
  randomizer: ${state.randomizer[key]}
  ${state.encrypted[key]?.slice(3, -2)}
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
