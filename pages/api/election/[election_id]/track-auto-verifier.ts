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

    const election = await firebase.firestore().collection('elections').doc(election_id).get()

    await pushover(
      'AutoVerifier FAIL',
      `auth_token: ${auth_token}\nelection_id: ${election_id}\ntitle: ${election.data()?.title}\n${location} (${
        req.headers['x-real-ip']
      })`,
    )
  }

  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const auto_verifier = firestore.FieldValue.arrayUnion({ timestamp: new Date(), verif_found })

  // Approved voters (incl. approved link votes, where auth_token === former link_auth)
  const [voterDoc] = (await electionDoc.collection('voters').where('auth_token', '==', auth_token).get()).docs
  if (voterDoc?.exists) {
    await voterDoc.ref.update({ auto_verifier })
    return res.status(200).send('Success.')
  }

  // Link votes still awaiting approval live in votes-pending/{link_auth}
  const pendingDoc = await electionDoc.collection('votes-pending').doc(auth_token).get()
  if (!pendingDoc.exists) return res.status(401).send('Voter not found')

  await pendingDoc.ref.update({ auto_verifier })
  return res.status(200).send('Success.')
}
