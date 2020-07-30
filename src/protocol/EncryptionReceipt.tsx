import { Paper } from '@material-ui/core'
import { map } from 'lodash'

import { encode } from './crypto/encode'
import { public_key } from './election-parameters'
import { useVoteContext } from './VoteContext'

export function EncryptionReceipt(): JSX.Element {
  const { state } = useVoteContext()

  return (
    <>
      <Paper elevation={3} style={{ padding: '0 1rem' }}>
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
  encoded: ${encode(state.plaintext[key])}
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
          opacity: 0.7;
          white-space: pre-wrap;
          tab-size: 4;
        }
      `}</style>
    </>
  )
}
