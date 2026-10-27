import { firebase } from 'api/_services'
import { G, random_bigint, RP, stringToPoint } from 'src/crypto/curve'
import { encrypt } from 'src/crypto/encrypt'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { BALLOT_METHODS, ballotDesignFor, BallotMethod, sharedDemoElectionId } from 'src/demo/interactiveDemo/content'
import { generateColumnNames } from 'src/vote/generateColumnNames'
import { generateTrackingNum } from 'src/vote/tracking-num'

export const SAMPLE_COUNT = 24

export async function createDemoElection(method: BallotMethod) {
  const { ADMIN_EMAIL } = process.env
  if (!ADMIN_EMAIL) throw new Error('Missing process.env.ADMIN_EMAIL')
  const db = firebase.firestore()
  const election = db.collection('elections').doc(sharedDemoElectionId(method))
  const key = election.collection('trustees').doc(ADMIN_EMAIL)
  return db.runTransaction(async (transaction) => {
    const [snapshot, privateKey] = await Promise.all([transaction.get(election), transaction.get(key)])
    const data = snapshot.data()
    if (snapshot.exists) {
      if (data?.is_demo !== true || !privateKey.data()?.private_keyshare)
        throw new Error(`Refusing to overwrite ${election.id}: unexpected demo configuration.`)
      return false
    }
    if (privateKey.exists) throw new Error(`Refusing to replace the orphaned key for ${election.id}.`)
    const { design, publicKey, samples, secret } = makeDemoBallots(method)
    transaction.create(election, {
      ballot_design: JSON.stringify([design]),
      ballot_design_finalized: true,
      created_at: new Date(),
      creator: 'siv-backend-demo',
      election_manager: 'SIV Demo',
      election_title: method === 'budget' ? 'Community Budget · Demo' : 'City Mayoral Election',
      is_demo: true,
      num_invalidated_votes: 0,
      num_pending_votes: 0,
      num_voters: SAMPLE_COUNT,
      num_votes: SAMPLE_COUNT,
      skip_shuffle_proofs: true,
      stop_accepting_votes: false,
      t: 1,
      threshold_public_key: publicKey,
      voter_applications_allowed: false,
    })
    transaction.create(key, {
      email: ADMIN_EMAIL,
      index: 0,
      name: 'The SIV Server',
      partial_decryption: 'stage = 12',
      private_keyshare: secret,
    })
    samples.forEach((encrypted_vote, index) => {
      const auth = generateAuthToken()
      transaction.create(election.collection('voters').doc(auth), {
        auth_token: auth,
        name: `Example voter ${index + 1}`,
      })
      transaction.create(election.collection('votes').doc(auth), {
        auth,
        created_at: new Date(Date.now() - (SAMPLE_COUNT - index) * 60_000),
        encrypted_vote,
        is_demo_sample: true,
      })
    })
    return true
  })
}

export function makeDemoBallots(method: BallotMethod) {
  const secret = random_bigint()
  const publicKey = G.multiply(secret).toHex()
  const design = ballotDesignFor(method)
  const { columns } = generateColumnNames({ ballot_design: [design] })
  const samples = Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const tracking = generateTrackingNum()
    const favorite = index < 14 ? 0 : index < 20 ? 1 : index < 23 ? 2 : 3
    return Object.fromEntries(
      columns.map((column, position) => {
        const name = design.options[(favorite + position) % design.options.length].name
        const selection =
          method === 'score'
            ? String(position === favorite ? 5 : 0)
            : method === 'budget'
            ? String(position === favorite ? 100_000 : 0)
            : method === 'plurality' || method === 'ranked' || position < 2
            ? name
            : 'BLANK'
        const cipher = encrypt(RP.fromHex(publicKey), random_bigint(), stringToPoint(`${tracking}:${selection}`))
        return [column, { encrypted: cipher.encrypted.toHex(), lock: cipher.lock.toHex() }]
      }),
    )
  })
  return { design, publicKey, samples, secret: secret.toString() }
}

// ponytail: Explicit one-time setup, not a public creation endpoint or work on the visitor's request.
if (import.meta.main) {
  void (async () => {
    for (const { id } of BALLOT_METHODS) {
      const created = await createDemoElection(id)
      console.log(`${sharedDemoElectionId(id)}: ${created ? 'created' : 'already configured'}`)
    }
  })().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
