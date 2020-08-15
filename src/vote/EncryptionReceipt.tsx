import { NoSsr } from '@material-ui/core'
import { map } from 'lodash-es'

import { encode } from '../crypto/encode'
import { Big } from '../crypto/types'
import { public_key } from '../protocol/election-parameters'
import { Paper } from '../protocol/Paper'

type Map = Record<string, string>
type EncryptedMap = { [index: string]: { encrypted: Big; unlock: Big } }
export function EncryptionReceipt({
  state,
}: {
  state: { encrypted: EncryptedMap; plaintext: Map; randomizer: Map }
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
    encrypted: ${state.encrypted[key].encrypted}
    unlock: ${state.encrypted[key].unlock}
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
        }
      `}</style>
    </NoSsr>
  )
}
