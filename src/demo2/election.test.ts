import { describe, expect, test } from 'bun:test'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'
import { tallyVotes } from 'src/status/tally-votes'
import { reducer } from 'src/vote/vote-state'

import {
  acceptSubmission,
  checkReceipt,
  createElection,
  detectionSample,
  initialBallot,
  Method,
  unlockElection,
} from './election'

describe('demo election uses real ballots end to end', () => {
  for (const method of ['plurality', 'approval'] as Method[]) {
    test(`${method}: accepted ciphertext decrypts to the original vote and verification number`, async () => {
      const election = createElection(method)
      const plaintext: Record<string, string> =
        method === 'plurality'
          ? { vote: 'Jane Kim' }
          : {
              vote_1: 'Jane Kim',
              vote_2: 'London Breed',
              vote_3: 'BLANK',
              vote_4: 'BLANK',
            }
      const state = reducer(initialBallot(election.publicKey, method), plaintext)
      if (!state.tracking) throw new Error('Missing verification number')
      const submission = { at: Date.now(), auth: election.auth, encrypted: state.encrypted }
      const accepted = acceptSubmission(election, submission)
      expect(accepted.submissions).toHaveLength(25)
      expect(() => acceptSubmission(accepted, submission)).toThrow('already been used')
      expect(() => acceptSubmission(election, { ...submission, auth: generateAuthToken() })).toThrow('not issued')
      expect(() => acceptSubmission(election, { ...submission, encrypted: {} })).toThrow('Incomplete')
      expect(() =>
        acceptSubmission(election, { ...submission, encrypted: { vote: { encrypted: 'bad', lock: 'bad' } } }),
      ).toThrow()
      const rows = await unlockElection(accepted)
      expect(rows).toHaveLength(25)
      expect(rows.find((row) => row.tracking === state.tracking)).toEqual({ ...plaintext, tracking: state.tracking })
      expect(rows.every((row) => !('auth' in row))).toBe(true)
      const { ballot_design } = state
      if (!ballot_design) throw new Error('Missing ballot')
      const tally = tallyVotes({ vote: ballot_design[0] }, rows)
      expect(tally.tallies.vote['Jane Kim']).toBe(method === 'plurality' ? 2 : 5)
      const checked = checkReceipt({
        encrypted: state.encrypted,
        public_key: election.publicKey,
        randomizer: state.randomizer,
      })
      expect(checked.some((line) => line.includes(`${state.tracking}:Jane Kim`))).toBe(true)
      const brokenRandomizers = Object.fromEntries(Object.keys(state.randomizer).map((key) => [key, '1']))
      expect(() =>
        checkReceipt({ encrypted: state.encrypted, public_key: election.publicKey, randomizer: brokenRandomizers }),
      ).toThrow()
    })
  }
})

test('illustrative audit draws increase as the margin narrows or detection probability rises', () => {
  expect(detectionSample(0.4, 0.05)).toBe(14)
  expect(detectionSample(0.2, 0.05)).toBeGreaterThan(detectionSample(0.4, 0.05) || 0)
  expect(detectionSample(0.4, 0.01)).toBeGreaterThan(detectionSample(0.4, 0.05) || 0)
  expect(detectionSample(0, 0.05)).toBeNull()
  expect(detectionSample(0.4, 0)).toBeNull()
  expect(detectionSample(1, 0.05)).toBe(5)
})
