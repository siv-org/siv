import { merge } from 'lodash-es'

// import pickRandomInteger from '../crypto/pick-random-integer'
// import { big } from '../crypto/types'
import { useLocalStorageReducer } from '../vote/useLocalStorage'

// Define our types
type Map = Record<string, string>
export type State = Record<string, unknown>

// Core state logic
function reducer(prev: State, payload: Map) {
  // Merge in new state from payload
  const newState = merge({ ...prev }, { ...payload })

  return newState
}

const initState = { foo: 'bar' }

// Export consumable hook that returns [state, dispatch]
export const useKeyGenState = (storage_key: string) => useLocalStorageReducer(storage_key, reducer, initState)
