import { Paper } from '@material-ui/core'
import { map } from 'lodash'
import { useState } from 'react'

import { useContext } from '../context'
import { encode } from '../crypto/encode'
import { public_key } from './election-parameters'

export default function SignedReceipt(): JSX.Element {
  const { state } = useContext()
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ margin: '15px 0', overflowWrap: 'break-word' }}>
      <a onClick={() => setVisible(!visible)} style={{ cursor: 'pointer', fontSize: 14 }}>
        {visible ? 'Hide' : 'Show'} Encryption Receipt
      </a>
      {visible && (
        <Paper elevation={3} style={{ marginTop: 15, padding: '0 1rem' }}>
          <code
            style={{
              fontSize: 11,
              maxWidth: '100%',
              opacity: 0.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {`
Encrypted @ ${new Date().toString()}

Public Key
  ${map(public_key, (v, k) => `${k}: ${v.toString()}`).join('\n  ')}

${map(
  state.plaintext,
  (_, key) => `${key}
  plaintext: ${state.plaintext[key]}
  encoded: ${encode(state.plaintext[key])}
  randomizer: ${state.randomizer[key]}
  encrypted: ${state.encrypted[key]}
`,
).join('\n')}
`}
          </code>
        </Paper>
      )}
    </div>
  )
}
