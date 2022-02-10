import { map } from 'lodash-es'

import { encode } from '../crypto/encode'
import { public_key } from './election-parameters'
import { Paper } from './Paper'
import { useVoteContext } from './VoteContext'

export function EncryptionReceipt(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <>
      <Paper>
        <code>
          {`
Encrypted @ ${new Date().toString()}

Encryption Formula
  https://en.wikipedia.org/wiki/ElGamal_encryption
  encrypted = encoded * (recipient ^ randomizer) % modulo
  unlock = (generator ^ randomizer) % modulo

Public Key
${public_key}

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
    </>
  )
}
