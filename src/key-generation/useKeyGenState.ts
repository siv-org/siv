import { merge } from 'lodash-es'

// import pickRandomInteger from '../crypto/pick-random-integer'
// import { big } from '../crypto/types'
import { useLocalStorageReducer } from '../vote/useLocalStorage'

// Define our types
type Map = Record<string, string>
export type State = {
  election_id: string
  trustee_auth: string
  trustees: { email: string; you?: boolean }[]
}

// Core state logic
function reducer(prev: State, payload: Map) {
  // Merge in new state from payload
  const newState = merge({ ...prev }, { ...payload })

  return newState
}

// Export consumable hook that returns [state, dispatch]
export const useKeyGenState = ({ election_id, trustee_auth }: { election_id: string; trustee_auth: string }) =>
  useLocalStorageReducer(`keygen-${election_id}-${trustee_auth}`, reducer, { election_id, trustee_auth })

export type StateAndDispatch = { dispatch: ReturnType<typeof useLocalStorageReducer>[1]; state: State }
