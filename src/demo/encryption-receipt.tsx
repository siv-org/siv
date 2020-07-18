import { Paper } from '@material-ui/core'
import { useState } from 'react'

import { useContext } from '../context'
import { stringify } from '../crypto/types'
import { public_key } from './election-parameters'

export default function SignedReceipt(): JSX.Element {
  const { state } = useContext()
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ margin: '15px 0', overflowWrap: 'break-word' }}>
      <a onClick={() => setVisible(!visible)} style={{ cursor: 'pointer', fontSize: 14 }}>
        {visible ? 'Hide' : 'Show'} example
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
Plaintext ballot:
${objToMultilineString(state.plaintext)}

Encryption parameters:

  public key: ${stringify(public_key)}
  random encryption factors: { vote_for_mayor: TODO, secret: TODO }


Encrypted at ${new Date().toString()} into:

${objToMultilineString(state.encrypted)}

`}
          </code>
        </Paper>
      )}
    </div>
  )
}

function objToMultilineString(obj: Record<string, string>) {
  return `{
  ${Object.keys(obj)
    .map((key) => `${key}: '${obj[key]}'`)
    .join(',\n  ')}
}`
}
