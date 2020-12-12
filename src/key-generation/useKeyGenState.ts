import { merge } from 'lodash-es'

import { generate_key_pair } from '../crypto/generate-key-pair'
import { useLocalStorageReducer } from '../vote/useLocalStorage'

// Define our types
type Map = Record<string, unknown>
export type State = {
  election_id: string
  parameters?: { g: string; p: string; q: string; t: number }
  personal_key_pair?: ReturnType<typeof generate_key_pair>
  trustee_auth: string
  trustees?: { email: string; you?: boolean }[]
}
// Typescript helper w/ State and Dispatch
export type StateAndDispatch = { dispatch: ReturnType<typeof useLocalStorageReducer>[1]; state: State }

// Core state logic
function reducer(prev: State, payload: Map) {
  // Merge in new state from payload
  const newState = merge({ ...prev }, { ...payload })

  return newState
}

// Export consumable hook that returns [state, dispatch]
export const useKeyGenState = ({ election_id, trustee_auth }: { election_id: string; trustee_auth: string }) =>
  useLocalStorageReducer(`keygen-${election_id}-${trustee_auth}`, reducer, { election_id, trustee_auth })
