import { mapValues, merge } from 'lodash-es'
import { random_bigint, RP, stringToPoint } from 'src/crypto/curve'
import { CipherStrings } from 'src/crypto/stringify-shuffle'

import { encrypt } from '../crypto/encrypt'
import { Item } from './storeElectionInfo'
import { generateTrackingNum } from './tracking-num'
import { useLocalStorageReducer } from './useLocalStorage'

export type State = {
  ballot_design?: Item[]
  ballot_design_finalized?: boolean
  custom_invitation_text?: string
  election_manager?: string
  election_title?: string
  encoded: Map
  encrypted: Record<string, CipherStrings>
  esignature_requested?: boolean
  last_modified_at?: Date
  plaintext: Map
  privacy_protectors_statements?: string
  public_key?: string
  randomizer: Map
  submission_confirmation?: string
  submitted_at?: Date
  tracking?: string
}
type Map = Record<string, string>

/** Core state logic */
function reducer(prev: State, payload: Map) {
  // Special handler for other state updates
  // that don't require encryption
  if (payload.ballot_design || payload.submitted_at || payload.esigned_at) {
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
  if (!prev.tracking) newState.tracking = generateTrackingNum()

  // Initialize empty dicts for intermediary steps
  const randomizer: Map = {}
  const encoded: Map = {}

  // For each key in plaintext
  const encrypted = mapValues(newState.plaintext, (value, key) => {
    // Encode the string into an element of our Prime Order Group
    encoded[key] = stringToPoint(`${newState.tracking}:${value}`).toHex()

    // Generate & store a randomizer
    const random = random_bigint()
    randomizer[key] = String(random)

    // Encrypt the encoded value w/ its randomizer
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const cipher = encrypt(RP.fromHex(prev.public_key!), random, RP.fromHex(encoded[key]))

    // Store the encrypted cipher as strings
    return mapValues(cipher, String)
  })

  return merge(newState, { encoded, encrypted, randomizer })
}

const initState = {
  encoded: {},
  encrypted: {},
  plaintext: {},
  randomizer: {},
}

/** Export consumable hook that returns [state, dispatch] */
export const useVoteState = (storage_key: string) => useLocalStorageReducer(storage_key, reducer, initState)
