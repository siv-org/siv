import { map } from 'lodash-es'
import { stringToPoint } from 'src/crypto/curve'

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
  in Ristretto255 prime-order subgroup of Elliptic Curve25519

  Encrypted = Encoded + (Recipient * randomizer)
  Lock = (Generator * randomizer)

Public Key
${public_key}

---------

Verification #: ${state.verification}

${map(
  state.plaintext,
  (value: string, key: string) => `${key}
  plaintext: ${state.verification}:${value}
  encoded: ${stringToPoint(value)}
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
