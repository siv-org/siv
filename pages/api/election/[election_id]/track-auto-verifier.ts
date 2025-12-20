import { firebase, pushover } from 'api/_services'
import { firestore } from 'firebase-admin'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { election_id } = req.query
  const { auth_token, verif_found } = req.body

  if (typeof election_id !== 'string') return res.status(400).send('Missing election_id')
  if (typeof auth_token !== 'string') return res.status(400).send('Missing auth_token')
  if (typeof verif_found !== 'boolean') return res.status(400).send('Missing verif_found')

  if (!verif_found) {
    // Pretty-print location
    const headers = ['x-vercel-ip-city', 'x-vercel-ip-country-region', 'x-vercel-ip-country']
    const location = headers.map((header) => req.headers[header]?.toString().replaceAll('%20', ' ')).join(', ')

    await pushover(
      'AutoVerifier FAIL',
      `auth_token: ${auth_token}\nelection_id: ${election_id}\n${location} (${req.headers['x-real-ip']})`,
    )
  }

  if (auth_token === 'link') {
    // TODO: Handle link auth votes
    return res.status(200).send("AutoVerifier doesn't support auth=link yet")
  }

  // Get the voter doc
  const [voterDoc] = (
    await firebase
      .firestore()
      .collection('elections')
      .doc(election_id)
      .collection('voters')
      .where('auth_token', '==', auth_token)
      .get()
  ).docs
  if (!voterDoc?.exists) return res.status(401).send('Voter not found')

  // Update the voter doc with the auto-verifier result
  await voterDoc.ref.update({
    auto_verifier: firestore.FieldValue.arrayUnion({ timestamp: new Date(), verif_found }),
  })

  //   console.log('AutoVerifier: verif_found', verif_found, auth_token)

  res.status(200).send('Success.')
}
