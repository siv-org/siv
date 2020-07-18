import { Paper } from '@material-ui/core'
import { useState } from 'react'

import { useContext } from '../context'

export default function SignedReceipt(): JSX.Element {
  const { state } = useContext()
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ margin: '15px 0', overflowWrap: 'break-word' }}>
      <a onClick={() => setVisible(!visible)} style={{ cursor: 'pointer', fontSize: 14 }}>
        {visible ? 'Hide' : 'Show'} example
      </a>
      {visible && (
        <Paper elevation={3} style={{ marginTop: 15, padding: '1rem' }}>
          <code
            style={{
              fontSize: 11,
              maxWidth: '100%',
              opacity: 0.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {`MIME-Version: 1.0
Content-Type: multipart/signed; protocol="application/x-pkcs7-signature"; micalg=sha1; boundary="----714A286D976BF3E58D9D671E37CBCF7C"

This is an S/MIME signed message

------714A286D976BF3E58D9D671E37CBCF7C

Marked ballot:
{ 
  ${Object.keys(state)
    .map((key) => `${key}: '${state[key]}'`)
    .join(',\n  ')}
}

Sealed at ${new Date().toString()} into:

d58e6fab72TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gSW50ZWdlciBuZWMgY29tbW9kbyBtYWduYS4gRnVzY2Ugdml0YWUgY29tbW9kbyBudWxsYS4gU2VkIGEgY3Vyc3V

------714A286D976BF3E58D9D671E37CBCF7C
Content-Type: application/x-pkcs7-signature; name="smime.p7s"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="smime.p7s"

MIIB6gYJKoZIhvcNAQcCoIIB2zCCAdcCAQExCzAJBgUrDgMCGgUAMAsGCSqGSIb3DQEHATGCAbYwggGyAgEBMIGcMIGOMQswCQYDVQQGEwJVUzEOMAwGA1UECBMFVGV4YXMxFDASBgNVBAcTC1NhbiBBbnRvbmlvMQ0wCwYDVQQKEwRVVFNBMQswCQYDVQQLEwJDUzEXMBUGA1UEAxMOYWkuY3MudXRzYS5lZHUxJDAiBgkqhkiG9w0BCQEWFWp1bGlldEBhaS5jcy51dHNhLmVkdQIJAMvyApGmAWbKMAkGBSsOAwIaBQCggbEwGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMDcwMjEyMjI1ODU4WjAjBgkqhkiG9w0BCQQxFgQUdBfDe/KmnhmYA9DILxfq/zKlvwEwUgYJKoZIhvcNAQkPMUUwQzAKBggqhkiG9w0DBzAOBggqhkiG9w0DAgICAIAwDQYIKoZIhvcNAwICAUAwBwYFKw4DAgcwDQYIKoZIhvcNAwICASgwDQYJKoZIhvcNAQEBBQAEQFbJ+8cZivvgvrjj8l1QbK2o7gWdWBM9yav6NJR2eBVj3hKGaKQ+7JNbygcqtVcMDIo1jSpsZas33BvhocwGOqs=

------714A286D976BF3E58D9D671E37CBCF7C--`}
          </code>
        </Paper>
      )}
    </div>
  )
}
