import { mapValues, merge } from 'lodash-es'
import { RP, random_bigint, stringToPoint } from 'src/crypto/curve'

import encrypt from '../crypto/encrypt'
import { Item } from './storeElectionInfo'
import { generateTrackingNum } from './tracking-num'
import { useLocalStorageReducer } from './useLocalStorage'

// Define our types
type Map = Record<string, string>
export type State = {
  ballot_design?: Item[]
  election_title?: string
  encoded: Map
  encrypted: Record<string, { encrypted: string; unlock: string }>
  esignature_requested?: boolean
  plaintext: Map
  public_key?: string
  randomizer: Map
  submitted_at?: Date
  tracking?: string
}

// Core state logic
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
        delete (newState as never)[group][key]
      })
    }
  })

  // Make sure we have a public key
  if (Object.keys(newState.plaintext) && !prev.public_key) {
    alert('The election admin has not finished setting an encryption address yet.')
    return prev
  }

  // Generate a new tracking number
  newState.tracking = generateTrackingNum()

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
    return mapValues(cipher, (c) => c.toString())
  })

  return merge(newState, { encoded, encrypted, randomizer })
}

const initState = {
  encoded: {},
  encrypted: {},
  plaintext: {},
  randomizer: {},
}

// Export consumable hook that returns [state, dispatch]
export const useVoteState = (storage_key: string) => useLocalStorageReducer(storage_key, reducer, initState)
