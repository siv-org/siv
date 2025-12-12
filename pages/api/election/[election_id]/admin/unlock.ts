import { readyForTallyingAuthTokens11Chooses } from 'api/11-chooses/tallying/get-auth-tokens-for-tally'
import bluebird from 'bluebird'
import { mapValues } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'
import { getStatus } from 'src/admin/Voters/Signature'
import { RP } from 'src/crypto/curve'
import { fastShuffle, shuffleWithoutProof, shuffleWithProof } from 'src/crypto/shuffle'
import { CipherStrings, stringifyShuffle, stringifyShuffleWithoutProof } from 'src/crypto/stringify-shuffle'

import { firebase, pushover } from '../../../_services'
import { pusher } from '../../../pusher'
import { checkJwtOwnsElection } from '../../../validate-admin-jwt'
import { ReviewLog } from './load-admin'

const { ADMIN_EMAIL } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const times = [Date.now()]
  const elapsed = (label: number | string) => {
    const l = String(label)
    const last = times[times.length - 1]
    const now = Date.now()
    times.push(now)
    const diff = String(now - last)
    console.log(`${l.padStart(23, ' ')} ${diff.padStart(5, ' ')}ms`)
  }

  // return res.status(200).json({ readyForTallyingAuthTokens11Chooses: readyForTallyingAuthTokens11Chooses.length })

  const start = new Date()

  if (!ADMIN_EMAIL) return res.status(501).json({ error: 'Missing process.env.ADMIN_EMAIL' })

  elapsed('init')

  const { election_id } = req.query as { election_id: string }
  // const { options = {} } = req.body
  // const { skip_shuffle_proofs } = options
  const skip_shuffle_proofs = true

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return
  elapsed('check jwt')

  const electionDoc = firebase
    .firestore()
    .collection('elections')
    .doc(election_id as string)

  // Begin preloading these requests
  const loadVotes = electionDoc.collection('votes').get()
  const election = electionDoc.get()
  const adminDoc = electionDoc.collection('trustees').doc(ADMIN_EMAIL)
  const admin = adminDoc.get()
  elapsed('preload db')

  // Is election_id in DB?
  if (!(await election).exists) return res.status(400).json({ error: `Unknown Election ID: '${election_id}'` })
  elapsed('election exists?')

  const { esignature_requested, t, threshold_public_key } = { ...(await election).data() } as {
    esignature_requested: boolean
    t: number
    threshold_public_key: string
  }
  elapsed('election data')
  if (!threshold_public_key) return res.status(400).json({ error: 'Election missing `threshold_public_key`' })

  // If esignature_requested, filter for only approved
  let votes_to_unlock = (await loadVotes).docs
  if (esignature_requested) {
    type VotersByAuth = Record<string, { esignature_review: ReviewLog[] }>
    const votersByAuth: VotersByAuth = (await electionDoc.collection('voters').get()).docs.reduce(
      (acc: VotersByAuth, doc) => {
        const data = doc.data()
        return { ...acc, [data.auth_token]: data }
      },
      {},
    )

    votes_to_unlock = votes_to_unlock.filter((doc) => {
      const { auth } = doc.data() as { auth: string }
      return getStatus(votersByAuth[auth].esignature_review) === 'approve'
    })
  }
  elapsed('load votes, filter esig')

  // Filter for only the auth tokens ready for tallying
  const selectedAuthTokens = new Set(readyForTallyingAuthTokens11Chooses)
  votes_to_unlock = votes_to_unlock.filter((doc) => {
    const { auth } = doc.data() as { auth: string }
    return selectedAuthTokens.has(auth)
  })
  elapsed('filter 11c approved only')
  // return res.status(200).json({ remaining: votes_to_unlock.length })

  // Admin removes the auth tokens
  const encrypteds_without_auth_tokens = votes_to_unlock.map((doc) => doc.data().encrypted_vote)
  elapsed('remove auth tokens')

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
  const split = encrypteds_without_auth_tokens.reduce((acc: Record<string, CipherStrings[]>, encrypted) => {
    Object.keys(encrypted).forEach((key) => {
      if (!acc[key]) acc[key] = []
      acc[key].push(encrypted[key])
    })
    return acc
  }, {})
  elapsed('split')

  // Is admin the only trustee?
  if (t === 1) {
    // Yes, we can begin decryption...
    const { private_keyshare: decryption_key } = { ...(await admin).data() } as { private_keyshare: string }

    // Fast shuffle, without building proofs, since there are no privacy protectors. We can still build a proof later
    const shuffled = await bluebird.props(
      mapValues(split, async (list) => fastShuffle(list.map((row) => mapValues(row, RP.fromHex)))),
    )
    elapsed('fastShuffle')

    // Decrypt votes
    const decrypted_and_split = await bluebird.props(
      mapValues(shuffled, async (list) => {
        // Decrypt each column in parallel
        const apiUrl = req.headers.host
        const protocol = apiUrl?.startsWith('localhost') ? 'http://' : 'https://'

        const response = await fetch(`${protocol}${apiUrl}/api/election/${election_id}/admin/decrypt-column`, {
          body: JSON.stringify({ column: list.map((cipher) => mapValues(cipher, String)), decryption_key }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })

        if (!response.ok) throw new Error(`Failed to decrypt column: ${await response.text()}`)

        return (await response.json()).decryptedColumn
      }),
    )
    elapsed('decrypt parallel')

    const decrypteds_by_tracking = recombine_decrypteds(decrypted_and_split)

    // Store decrypteds as an array
    const decrypted = Object.values(decrypteds_by_tracking)

    await electionDoc.update({ decrypted, last_decrypted_at: new Date() })
    elapsed('store decrypted')

    await pusher.trigger(election_id, 'decrypted', '')

    const done = new Date()
    const time = done.getTime() - start.getTime()
    const numUnlocked = votes_to_unlock.length
    const numColumns = Object.keys(split).length
    const numCiphertexts = numUnlocked * numColumns
    console.log(
      `🔑 Unlocked ${numUnlocked} votes with ${numColumns} columns (${numCiphertexts} ciphertexts) in ${time.toLocaleString()}ms. (${(
        time / numCiphertexts
      ).toFixed(2)} ms/ciphertext)`,
    )
  } else {
    console.log('starting admin shuffle')
    // Then admin does a SIV shuffle (permute + re-encryption) for each item's list
    const shuffled = await bluebird.props(
      mapValues(split, async (list) => {
        const shuffleArgs: Parameters<typeof shuffleWithProof> = [
          RP.fromHex(threshold_public_key),
          list.map((row) => mapValues(row, RP.fromHex)),
        ]

        if (skip_shuffle_proofs) {
          return stringifyShuffleWithoutProof(await shuffleWithoutProof(...shuffleArgs))
        } else {
          return stringifyShuffle(await shuffleWithProof(...shuffleArgs))
        }
      }),
    )

    // Store admins shuffled lists
    console.log("starting to write admin's shuffle to db\n\n\n\n\n")
    await Promise.all([
      electionDoc.update({ skip_shuffle_proofs: !!skip_shuffle_proofs }),
      adminDoc.update({ shuffled }),
      adminDoc.collection('post-election-data').doc('preshuffled').set({ preshuffled: split }),
    ])
    console.log("succeeded to write admin's shuffle.")
    try {
      await pusher.trigger(`keygen-${election_id}`, 'update', {
        'admin@secureintervoting.org': { shuffled: shuffled.length },
      })
    } catch (e) {
      await pushover('Failed to Pusher.trigger(keygen, update, admin@, shuffled)', JSON.stringify(e))
    }
  }

  return res.status(201).json({ message: 'Triggered unlock' })
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
