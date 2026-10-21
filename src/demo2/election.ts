import { secretsMatch } from 'src/_shared/secretsMatch'
import { G, pointToString, random_bigint, RP } from 'src/crypto/curve'
import { decrypt, decryptWithRandomizer } from 'src/crypto/decrypt'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { shuffleWithoutProof } from 'src/crypto/shuffle'
import { ballotDesignFor } from 'src/demo/interactiveDemo/content'
import { generateColumnNames } from 'src/vote/generateColumnNames'
import { reducer, State } from 'src/vote/vote-state'

export type Election = {
  auth: string
  method: Method
  publicKey: string
  secret: bigint
  submissions: Submission[]
}
export type Method = 'approval' | 'plurality'
export type Receipt = Pick<State, 'encrypted' | 'public_key' | 'randomizer'>
export type Submission = { at: number; auth: string; encrypted: State['encrypted'] }

/** Demo transport validates a credential, ballot columns, and curve encodings before accepting once. */
export function acceptSubmission(election: Election, submission: Submission): Election {
  if (!secretsMatch(submission.auth, election.auth))
    throw new Error('This Voter Code was not issued for this demo election.')
  if (election.submissions.some((v) => secretsMatch(v.auth, submission.auth)))
    throw new Error('This Voter Code has already been used.')
  const { columns } = generateColumnNames({ ballot_design: [ballotDesignFor(election.method)] })
  if (columns.length !== Object.keys(submission.encrypted).length) throw new Error('Incomplete ballot.')
  columns.forEach((column) => {
    RP.fromHex(submission.encrypted[column].encrypted)
    RP.fromHex(submission.encrypted[column].lock)
  })
  return {
    ...election,
    submissions: [...election.submissions, { at: Date.now(), auth: submission.auth, encrypted: submission.encrypted }],
  }
}

export function checkReceipt(receipt: Receipt): string[] {
  if (!receipt.public_key || !Object.keys(receipt.encrypted).length || Object.keys(receipt.encrypted).length > 8)
    throw new Error('Invalid receipt.')
  return Object.keys(receipt.encrypted)
    .sort()
    .map((column) => {
      const cipher = receipt.encrypted[column]
      const message = decryptWithRandomizer(RP.fromHex(receipt.public_key || ''), BigInt(receipt.randomizer[column]), {
        encrypted: RP.fromHex(cipher.encrypted),
        lock: RP.fromHex(cipher.lock),
      })
      // Check the randomizer against the lock as well as decrypting the content.
      if (!G.multiply(BigInt(receipt.randomizer[column])).equals(RP.fromHex(cipher.lock)))
        throw new Error('Receipt randomizer does not match the submitted lock.')
      return `${column}: ${pointToString(message)}`
    })
}

export function createElection(method: Method): Election {
  const secret = random_bigint()
  const publicKey = G.multiply(secret).toHex()
  const design = ballotDesignFor(method)
  const { columns } = generateColumnNames({ ballot_design: [design] })
  // Fictional voters, actual encrypted ballots. All use the same ballot design.
  const submissions = Array.from({ length: 24 }, (_, i) => {
    const selections =
      method === 'plurality' ? [i < 14 ? 0 : i < 20 ? 1 : i < 23 ? 2 : 3] : i < 14 ? [0, 1] : i < 20 ? [0, 2] : [2, 3]
    const plaintext = Object.fromEntries(
      columns.map((column, n) => [column, design.options[selections[n]]?.name || 'BLANK']),
    )
    const state = reducer(initialBallot(publicKey, method), plaintext)
    return {
      at: Date.now() - (24 - i) * 60_000,
      auth: generateAuthToken(),
      encrypted: state.encrypted,
    }
  })
  return { auth: generateAuthToken(), method, publicKey, secret, submissions }
}

/** With-replacement detection illustration, NOT a certified risk-limiting audit. */
export function detectionSample(margin: number, risk: number) {
  if (margin <= 0 || margin > 1 || risk <= 0 || risk >= 1) return null
  return Math.ceil(Math.log(risk) / Math.log(1 - margin / 2))
}

export function initialBallot(publicKey: string, method: Method): State {
  return {
    ballot_design: [ballotDesignFor(method)],
    ballot_design_finalized: true,
    election_title: 'City Mayoral Election · Example',
    encoded: {},
    encrypted: {},
    plaintext: {},
    public_key: publicKey,
    randomizer: {},
  }
}

/** Real re-encryption and decryption; a single local key replaces independent trustees in this demo. */
export async function unlockElection(election: Election): Promise<Record<string, string>[]> {
  const rows: Record<string, Record<string, string>> = {}
  const { columns } = generateColumnNames({ ballot_design: [ballotDesignFor(election.method)] })
  for (const column of columns) {
    const inputs = election.submissions.map((v) => ({
      encrypted: RP.fromHex(v.encrypted[column].encrypted),
      lock: RP.fromHex(v.encrypted[column].lock),
    }))
    const { shuffled } = await shuffleWithoutProof(RP.fromHex(election.publicKey), inputs)
    shuffled.forEach((cipher) => {
      const decoded = pointToString(decrypt(election.secret, cipher))
      const separator = decoded.indexOf(':')
      const tracking = decoded.slice(0, separator)
      rows[tracking] = { ...rows[tracking], [column]: decoded.slice(separator + 1), tracking }
    })
  }
  return Object.values(rows).sort((a, b) => a.tracking.localeCompare(b.tracking))
}
