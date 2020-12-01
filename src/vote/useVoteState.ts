import { mapValues, merge } from 'lodash-es'

import { encode } from '../crypto/encode'
import encrypt from '../crypto/encrypt'
import pickRandomInteger from '../crypto/pick-random-integer'
import { big } from '../crypto/types'
import { public_key } from '../protocol/election-parameters'
import { generateTrackingNum } from './tracking-num'
import { useLocalStorageReducer } from './useLocalStorage'

// Define our types
type Map = Record<string, string>
export type State = {
  encoded: Map
  encrypted: Record<string, { encrypted: string; unlock: string }>
  plaintext: Map
  randomizer: Map
  submitted_at?: Date
}

// Core state logic
function reducer(prev: State, payload: Map) {
  // Special handler for the "submit" payload
  if (payload.submit) {
    return { ...prev, submitted_at: new Date() }
  }

  // Merge in new state from payload
  const newState = merge({ ...prev }, { plaintext: payload })

  // Filter out empty values
  Object.keys(newState.plaintext).forEach((key) => {
    if (newState.plaintext[key] == '') {
      Object.keys(initState).forEach((group) => {
        delete (newState as never)[group][key]
      })
    }
  })

  // Generate a new tracking number
  newState.plaintext.tracking = generateTrackingNum()

  // Initialize empty dicts for intermediary steps
  const randomizer: Map = {}
  const encoded: Map = {}

  // For each key in plaintext
  const encrypted = mapValues(newState.plaintext, (value, key) => {
    // Encode the string into an integer
    encoded[key] = encode(value)

    // Generate & store a randomizer
    const random = pickRandomInteger(public_key.modulo)
    randomizer[key] = random.toString()

    // Encrypt the encoded value w/ its randomizer
    const cipher = encrypt(public_key, random, big(encoded[key]))

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
