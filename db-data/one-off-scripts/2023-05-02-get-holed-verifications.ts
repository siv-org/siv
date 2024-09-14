import '../_env'

import { mapValues } from 'lodash'

import { firebase } from '../../pages/api/_services'
import { RP, pointToString } from '../../src/crypto/curve'
import decrypt from '../../src/crypto/decrypt'
import { CipherStrings } from '../../src/crypto/stringify-shuffle'
import { votesWithHoles } from './votes-with-holes'

const election_id = '1680323766282'

;(async function main() {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  // Get unlocking key
  const { ADMIN_EMAIL } = process.env
  if (!ADMIN_EMAIL) throw 'Missing process.env.ADMIN_EMAIL'
  const admin = electionDoc.collection('trustees').doc(ADMIN_EMAIL).get()
  const { private_keyshare: decryption_key } = { ...(await admin).data() } as { private_keyshare: string }

  const authToTracking = {}

  await Promise.all(
    Object.values(votesWithHoles)
      // .slice(0, 1)
      .map((subset) =>
        Promise.all(
          Object.keys(subset).map(async (auth: string) => {
            if (auth.startsWith('_')) return // Skip tally subtotals

            // Look up encrypted vote
            const { encrypted_vote } = (
              await electionDoc.collection('votes').where('auth', '==', auth).get()
            ).docs[0].data()

            // Decrypt the vote
            const decryptedWithVerification = mapValues(encrypted_vote as Record<string, CipherStrings>, (cipher) =>
              pointToString(decrypt(BigInt(decryption_key), mapValues(cipher, RP.fromHex))),
            )
            // Find Verification #
            const [unpadded_tracking] = Object.values(decryptedWithVerification)[0].split(':')
            const tracking = unpadded_tracking.padStart(14, '0')

            authToTracking[auth] = tracking
          }),
        ),
      ),
  )

  let sorted = ``
  Object.keys(authToTracking)
    .sort()
    .forEach((auth) => (sorted += `${auth}: ${authToTracking[auth]}\n`))

  console.log(sorted)
})()
