import { mapValues, merge } from 'lodash-es'

import { encode } from '../crypto/encode'
import encrypt from '../crypto/encrypt'
import pickRandomInteger from '../crypto/pick-random-integer'
import { big, bigPubKey } from '../crypto/types'
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
  plaintext: Map
  public_key: { generator: string; modulo: string; recipient: string }
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

  // Generate a new tracking number
  newState.tracking = generateTrackingNum()

  // Initialize empty dicts for intermediary steps
  const randomizer: Map = {}
  const encoded: Map = {}

  // For each key in plaintext
  const encrypted = mapValues(newState.plaintext, (value, key) => {
    // Encode the string into an integer
    encoded[key] = encode(`${newState.tracking}:${value}`)

    // Generate & store a randomizer
    const random = pickRandomInteger(big(prev.public_key.modulo))
    randomizer[key] = random.toString()

    // Encrypt the encoded value w/ its randomizer
    const cipher = encrypt(bigPubKey(prev.public_key), random, big(encoded[key]))

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
