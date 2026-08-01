import { mapValues, merge, pick } from 'lodash-es'
import { random_bigint, RP, stringToPoint } from 'src/crypto/curve'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { encrypt } from '../crypto/encrypt'
import { Item } from './storeElectionInfo'
import { generateTrackingNum } from './tracking-num'
import { useLocalStorageReducer } from './useLocalStorage'

export type State = VoteData & {
  auth_added_at?: string
  ballot_design?: Item[]
  ballot_design_finalized?: boolean
  custom_invitation_text?: string
  election_manager?: string
  election_title?: string
  esignature_requested?: boolean
  last_modified_at?: Date
  link_auth?: string
  previous_submissions?: (VoteData & { replaced_at: string })[]
  privacy_protectors_statements?: string
  public_key?: string
  submission_confirmation?: string
}

type Map = Record<string, string>
type VoteData = {
  encoded: Map
  encrypted: Record<string, CipherStrings>
  plaintext: Map
  randomizer: Map
  submitted_at?: Date
  tracking?: string
}

/** Core state logic */
export function reducer(prev: State, payload: Map) {
  // Customize verification #: re-encrypt under the new tracking, & archive prior
  if (payload.tracking && payload.tracking !== prev.tracking) {
    if (!prev.public_key) return fail(prev, 'prev.public_key')
    if (!prev.tracking) return fail(prev, 'prev.tracking')
    if (!prev.plaintext || !Object.keys(prev.plaintext).length) return fail(prev, 'prev.plaintext')

    return {
      ...prev,
      ...encryptSelections(prev.plaintext, payload.tracking, prev.public_key),
      last_modified_at: new Date(),
      previous_submissions: [
        ...(prev.previous_submissions || []),
        {
          ...pick(prev, ['encoded', 'encrypted', 'plaintext', 'randomizer', 'submitted_at', 'tracking']),
          replaced_at: new Date().toISOString(),
        },
      ],
      tracking: payload.tracking,
    }
  }

  // Special handler for other state updates
  // that don't require encryption
  if (payload.ballot_design || payload.submitted_at || payload.esigned_at || payload.link_auth) {
    return { ...prev, ...payload }
  }

  // Merge in new state from payload
  const newState = merge({ ...prev }, { last_modified_at: new Date(), plaintext: payload })

  // Filter out empty values
  Object.keys(newState.plaintext).forEach((key) => {
    if (newState.plaintext[key] == '') {
      Object.keys(initState).forEach((group) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- don't encrypt empty strings
        delete (newState as never)[group][key]
      })
    }
  })

  // Stop if no public key
  if (Object.keys(newState.plaintext) && !prev.public_key) return prev

  // Generate Verification number if needed
  if (!newState.tracking) newState.tracking = generateTrackingNum()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return merge(newState, encryptSelections(newState.plaintext, newState.tracking, prev.public_key!))
}

function encryptSelections(plaintext: Map, tracking: string, public_key: string) {
  // Initialize empty dicts for intermediary steps
  const randomizer: Map = {}
  const encoded: Map = {}

  // For each key in plaintext
  const encrypted = mapValues(plaintext, (value, key) => {
    // Encode the string into an element of our Prime Order Group
    encoded[key] = stringToPoint(`${tracking}:${value}`).toHex()

    // Generate & store a randomizer
    const random = random_bigint()
    randomizer[key] = String(random)

    // Encrypt the encoded value w/ its randomizer
    const cipher = encrypt(RP.fromHex(public_key), random, RP.fromHex(encoded[key]))

    // Store the encrypted cipher as strings
    return mapValues(cipher, String)
  })
  return { encoded, encrypted, randomizer }
}

function fail(prev: State, item: string) {
  if (process.env.NODE_ENV !== 'test') {
    const msg = `Error: ${item} missing`
    console.error(msg, prev)
    alert(msg)
  }
  return prev
}

const initState = {
  encoded: {},
  encrypted: {},
  plaintext: {},
  randomizer: {},
}

/** Export consumable hook that returns [state, dispatch] */
export const useVoteState = (storage_key: string) => useLocalStorageReducer(storage_key, reducer, initState)
