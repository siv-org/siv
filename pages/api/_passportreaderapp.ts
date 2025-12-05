const { PASSPORTREADERAPP_PUBLIC, PASSPORTREADERAPP_SECRET } = process.env
if (!PASSPORTREADERAPP_PUBLIC) console.warn('PASSPORTREADERAPP_PUBLIC undefined')
if (!PASSPORTREADERAPP_SECRET) console.warn('PASSPORTREADERAPP_SECRET undefined')

const apiUrl = 'https://passportreader.app/api/v1'
const auth = Buffer.from(`${PASSPORTREADERAPP_PUBLIC}:${PASSPORTREADERAPP_SECRET}`).toString('base64')
const headers = { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }

/** Step 1 — Create a session
Always start by creating a new session from your backend system:

Response: {
    "id": 123,
    "token": "i_dI5hs7m...",
    ...
} */
export async function createSession() {
  const res = await fetch(`${apiUrl}/session.create`, { body: JSON.stringify({}), headers, method: 'POST' })

  if (!res.ok) throw new Error(`Failed to create session: ${res.statusText}`)

  return res.json()
}

export async function getPassportResults(id: number) {
  const res = await fetch(`${apiUrl}/session.get`, { body: JSON.stringify({ id }), headers, method: 'POST' })

  if (!res.ok) console.error(`Failed to get passport results: ${res.statusText}`)

  return res.json()
}
