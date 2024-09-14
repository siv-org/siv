import '../_env'

import { mapValues } from 'lodash'
import UAParser from 'ua-parser-js'

import { firebase } from '../../pages/api/_services'
import { RP, pointToString } from '../../src/crypto/curve'
import decrypt from '../../src/crypto/decrypt'
import { CipherStrings } from '../../src/crypto/stringify-shuffle'

// CHANGE ME 👇
const election_id = '1680323766282'
const auth_token = ''

const { ADMIN_EMAIL } = process.env
if (!ADMIN_EMAIL) throw 'Missing process.env.ADMIN_EMAIL'
;(async function main() {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  console.log('Loading election data...\n')
  const election = electionDoc.get()
  const { last_decrypted_at } = { ...(await election).data() } as { last_decrypted_at: Date }
  const admin = electionDoc.collection('trustees').doc(ADMIN_EMAIL).get()
  const votersDocs = await electionDoc.collection('voters').where('auth_token', '==', auth_token).get()
  console.log('Found voters:', votersDocs.docs.length)
  votersDocs.docs.map((voter) => {
    console.log({ ...voter.data(), id: voter.id })
  })

  const { private_keyshare: decryption_key } = { ...(await admin).data() } as { private_keyshare: string }
  console.log("Found admin's key")
  const votesDocs = await electionDoc.collection('votes').where('auth', '==', auth_token).get()
  console.log('Found votes:', votesDocs.docs.length)

  const votes = votesDocs.docs.map((vote) => {
    const data = { ...vote.data() } as {
      auth: string
      created_at: { _seconds: number }
      encrypted_vote: Record<string, CipherStrings>
      headers: Record<string, string>
    }

    // Decrypt
    const decryptedWithVerification = mapValues(data.encrypted_vote, (cipher) =>
      pointToString(decrypt(BigInt(decryption_key), mapValues(cipher, RP.fromHex))),
    )
    // Separate Verification # from other fields
    const decrypted: Record<string, string> = {}
    Object.entries(decryptedWithVerification).forEach(([key, value], index) => {
      const [unpadded_tracking, selection] = value.split(':')
      const tracking = unpadded_tracking.padStart(14, '0')

      // Skip if 'BLANK'
      if (selection === 'BLANK') return

      // Store tracking if first
      if (index === 0) decrypted.tracking = tracking

      // Throw if tracking changes
      if (tracking !== decrypted.tracking)
        throw `${vote.id} tracking changed. Expected ${decrypted.tracking}. Item '${key}' has ${tracking}`

      decrypted[key] = selection
    })

    const { headers } = data
    const ip = {
      city: decodeURI(headers['x-vercel-ip-city']),
      state: headers['x-vercel-ip-country-region'],
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      country: headers['x-vercel-ip-country'],
      ip: headers['x-real-ip'],
    }
    const submittedAt = new Date(data.created_at._seconds * 1000)
    const ua = UAParser(headers['user-agent'])

    // console.log(data)

    return {
      auth: data.auth,
      decrypted,
      device: `${ua.browser.name} ${ua.browser.version} on ${ua.os.name} ${ua.os.version}`,
      id: vote.id,
      ip,
      submittedAt,
      unlockSinceSubmitted: last_decrypted_at < submittedAt,
    }
  })

  console.log(votes)
})()
