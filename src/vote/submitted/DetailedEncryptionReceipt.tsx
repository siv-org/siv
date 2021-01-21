import { map } from 'lodash-es'
import { useReducer } from 'react'

import { Paper } from '../../protocol/Paper'
import { State } from '../vote-state'

export const DetailedEncryptionReceipt = ({ state }: { state: State & { submitted_at: Date } }) => {
  const [show, toggle] = useReducer((state) => !state, false)
  return (
    <>
      <p className="toggle">
        <a onClick={toggle}>{show ? '[-] Hide' : '[+] Show'} Encryption Details</a>
      </p>

      <Paper noFade style={{ display: show ? 'block' : 'none', maxWidth: 815, padding: '1.5rem' }}>
        <code>
          {`Submitted @ ${new Date(state.submitted_at)}

Encryption Formula
  https://en.wikipedia.org/wiki/ElGamal_encryption
  encrypted = encoded * (recipient ^ randomizer) % modulo
  unlock = (generator ^ randomizer) % modulo

Public Key
  ${map(state.public_key, (v, k) => `${k}: ${v}`).join('\n  ')}

---------

Verification #: ${state.tracking}

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
        p.toggle {
          font-size: 12px;
          opacity: 0.7;
        }

        p.toggle a {
          cursor: pointer;
        }

        code {
          font-size: 11px;
          max-width: 100%;
          white-space: pre-wrap;
        }
      `}</style>
    </>
  )
}
