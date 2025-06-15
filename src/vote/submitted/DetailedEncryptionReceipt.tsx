import { RP } from 'src/crypto/curve'

import { Paper } from '../../protocol/Paper'
import { State } from '../vote-state'

export const DetailedEncryptionReceipt = ({
  auth,
  election_id,
  state,
}: {
  auth?: string
  election_id?: string
  state: State & { submitted_at?: Date }
}) => {
  return (
    <Paper noFade style={{ maxWidth: 815, padding: '1.5rem' }}>
      <code>
        {`DETAILED ENCRYPTION RECEIPT

Election: ${state.election_title}
Election ID: ${election_id}
Voter Auth Token: ${auth}

---------

${
  state.submitted_at
    ? `Submitted at: ${new Date(state.submitted_at)}`
    : `Submitted: Not yet\nLast modified: ${new Date(state.last_modified_at || new Date())}`
}

---------

Encryption Formula
  https://en.wikipedia.org/wiki/ElGamal_encryption
  in the Ristretto255 prime-order group derived from Curve25519

  Encrypted = Encoded + (Recipient * randomizer)
  Lock = (Generator * randomizer)

Encryption Public Key
  Recipient: ${state.public_key}
  Generator: ${RP.BASE.toHex()}

---------

Verification #: ${state.tracking}

${Object.keys(state.plaintext)
  .sort()
  .map(
    (key) => `${key}
  plaintext: ${state.tracking}:${state.plaintext[key]}
  encoded: ${state.encoded[key]}
  randomizer: ${state.randomizer[key]}
    encrypted: ${state.encrypted[key].encrypted}
    lock: ${state.encrypted[key].lock}
`,
  )
  .join('\n')}`}
      </code>
      <style jsx>{`
        code {
          font-size: 11px;
          max-width: 100%;
          white-space: pre-wrap;
        }
      `}</style>
    </Paper>
  )
}
