import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*') // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end() // CORS pre-flight requests

  // NewAmericanPrimary.org submits their auth info
  // Passport proof, or verified sms number

  const { link_auth } = req.body
  if (!link_auth) return res.status(400).send('Missing req.body.link_auth')

  // TODO: Validate the data is from NAP
  // Have them include a shared key?

  // TODO: Validate passport proof
  // TODO: Check passport proof for uniqueness against all other entries in DB. If not unique, still store but mark as `rejected`.

  await Promise.all([
    pushover('POST new-american-primary/auth', JSON.stringify(req.body)),

    // Store info in db
    firebase
      .firestore()
      .collection('new-american-primary')
      .doc(link_auth)
      .set(
        {
          payloads: firestore.FieldValue.arrayUnion({
            created_at: new Date(),
            headers: req.headers,
            req_body: req.body,
          }),
        },
        { merge: true },
      ),
  ])

  // Send success down to client
  return res.status(201).send(`Stored req.body for link_auth=${link_auth}`)
}
