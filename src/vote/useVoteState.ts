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
  encrypted: Record<string, ReturnType<typeof encrypt>>
  plaintext: Map
  randomizer: Map
}

// Core state logic
function reducer(prev: State, payload: Map) {
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
    // Generate a randomizer
    const random = pickRandomInteger(public_key.modulo)
    randomizer[key] = random.toString()

    // Store the encoded value
    encoded[key] = encode(value as string)

    // Encrypt the value
    return encrypt(public_key, random, big(encoded[key] as string))
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
