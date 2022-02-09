import bluebird from 'bluebird'
import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { getStatus } from 'src/admin/Voters/Signature'
import { RP, pointToString } from 'src/crypto/curve'
import decrypt from 'src/crypto/decrypt'
import { shuffle } from 'src/crypto/shuffle'
import { stringifyShuffle } from 'src/crypto/stringify-shuffle'

import { firebase, pushover } from '../../../_services'
import { pusher } from '../../../pusher'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'
import { ReviewLog } from './load-admin'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })

  const { election_id } = req.query as { election_id: string }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading these requests
  const loadVotes = electionDoc.collection('votes').get()
  const loadVoters = electionDoc.collection('voters').get()
  const election = electionDoc.get()
  const adminDoc = electionDoc.collection('trustees').doc(ADMIN_EMAIL)
  const admin = adminDoc.get()

  // Is election_id in DB?
  if (!(await election).exists) return res.status(400).json({ error: `Unknown Election ID: '${election_id}'` })

  const { esignature_requested, t, threshold_public_key } = { ...(await election).data() } as {
    esignature_requested: boolean
    t: number
    threshold_public_key: string
  }

  type Cipher = { encrypted: string; unlock: string }

  // If esignature_requested, filter for only approved
  let votes_to_unlock = (await loadVotes).docs
  if (esignature_requested) {
    type VotersByAuth = Record<string, { esignature_review: ReviewLog[] }>
    const votersByAuth: VotersByAuth = (await loadVoters).docs.reduce((acc: VotersByAuth, doc) => {
      const data = doc.data()
      return { ...acc, [data.auth_token]: data }
    }, {})

    votes_to_unlock = votes_to_unlock.filter((doc) => {
      const { auth } = doc.data() as { auth: string }
      return getStatus(votersByAuth[auth].esignature_review) === 'approve'
    })
  }

  // Admin removes the auth tokens
  const encrypteds_without_auth_tokens = votes_to_unlock.map((doc) => doc.data().encrypted_vote)

  // Then we split up the votes into individual lists for each item
  // input: [
  //   { item1: Cipher, item2: Cipher },
  //   { item1: Cipher, item2: Cipher },
  //   { item1: Cipher, item2: Cipher },
  // ]
  // output: {
  //   item1: [Cipher, Cipher, Cipher],
  //   item2: [Cipher, Cipher, Cipher],
  // }
  const split = encrypteds_without_auth_tokens.reduce((acc: Record<string, Cipher[]>, encrypted) => {
    Object.keys(encrypted).forEach((key) => {
      if (!acc[key]) acc[key] = []
      acc[key].push(encrypted[key])
    })
    return acc
  }, {})

  // Then admin does a SIV shuffle (permute + re-encryption) for each item's list
  const shuffled = await bluebird.props(
    mapValues(split, async (list) =>
      stringifyShuffle(
        await shuffle(
          RP.fromHex(threshold_public_key),
          list.map((row) => mapValues(row, RP.fromHex)),
        ),
      ),
    ),
  )

  // Store admins shuffled lists
  await adminDoc.update({ preshuffled: split, shuffled })
  try {
    await pusher.trigger(`keygen-${election_id}`, 'update', {
      'admin@secureintervoting.org': { shuffled: shuffled.length },
    })
  } catch (e) {
    await pushover('Failed to Pusher.trigger(keygen, update, admin@, shuffled)', JSON.stringify(e))
  }

  // Is admin the only trustee?
  if (t === 1) {
    // Yes, we can begin decryption...
    const { private_keyshare: decryption_key } = { ...(await admin).data() } as { private_keyshare: string }

    // Decrypt votes
    const decrypted_and_split = mapValues(shuffled, (list) => {
      return list.shuffled.map((cipher) =>
        pointToString(decrypt(BigInt(decryption_key), mapValues(cipher, RP.fromHex))),
      )
    })

    const decrypteds_by_tracking = recombine_decrypteds(decrypted_and_split)

    // Store decrypteds as an array
    const decrypted = Object.values(decrypteds_by_tracking)

    await electionDoc.update({ decrypted, last_decrypted_at: new Date() })

    await pusher.trigger(election_id, 'decrypted', '')
  }

  res.status(201).json({ message: 'Triggered unlock' })
}

/** Recombine the columns back together via tracking numbers */
export const recombine_decrypteds = (decrypted_and_split: Record<string, string[]>) => {
  type Recombined = Record<string, Record<string, string>>
  const decrypteds_by_tracking = Object.keys(decrypted_and_split).reduce((acc: Recombined, key) => {
    decrypted_and_split[key].forEach((value) => {
      const [unpadded_tracking, vote] = value.split(':')

      const tracking = unpadded_tracking.padStart(14, '0')

      // Skip if 'BLANK'
      if (vote === 'BLANK') return

      // Create vote obj if needed
      if (!acc[tracking]) {
        acc[tracking] = { tracking }
      }

      acc[tracking] = { ...acc[tracking], [key]: vote }
    })
    return acc
  }, {})

  return decrypteds_by_tracking
}
