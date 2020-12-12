import { merge } from 'lodash-es'

import { useLocalStorageReducer } from '../vote/useLocalStorage'

// Define our types
type Map = Record<string, unknown>
export type State = {
  election_id: string
  trustee_auth: string
  trustees: { email: string; you?: boolean }[]
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
