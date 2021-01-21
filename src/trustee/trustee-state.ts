import { merge } from 'lodash-es'

import { Parameters } from '../crypto/threshold-keygen'
import { big } from '../crypto/types'
import { useLocalStorageReducer } from '../vote/useLocalStorage'
import { diff } from './keygen/diff-objects'

// Define our types
export type Shuffled = Record<string, string[]>

export type Trustee = {
  commitments: string[]
  email: string
  encrypted_pairwise_shares_for: Record<string, string>
  index: number
  partial_decryption?: string
  partials?: Record<string, string[]>
  recipient_key?: string
  shuffled?: Shuffled
  verified?: Record<string, boolean>
  you?: boolean
}
export type State = {
  commitments?: string[]
  decrypted_shares_from?: Record<string, string>
  election_id: string
  encrypted_pairwise_shares_for?: Record<string, string>
  own_email: string
  own_index: number
  pairwise_randomizers_for?: Record<string, string>
  pairwise_shares_for?: Record<string, string>
  parameters?: { g: string; p: string; q: string; t: number }
  partial_decryption?: string
  personal_key_pair?: { decryption_key: string; public_key: { recipient: string } }
  private_coefficients?: string[]
  private_keyshare?: string
  threshold_public_key?: string
  trustee_auth: string
  trustees?: Trustee[]
  verified?: Record<string, boolean>
}

export type Dispatch = ReturnType<typeof useLocalStorageReducer>[1]

/**
 * Typescript helper w/ State and Dispatch
 * @property dispatch - Takes {key: value} and sticks it in local storage
 * @property state - The current state, persisted in localstorage against refreshes, window closes, etc
 */
export type StateAndDispatch = {
  dispatch: Dispatch
  state: State
}

// Core state logic
function reducer(prev: State, payload: Record<string, unknown>) {
  // Special handler for reset
  if (payload.reset) return payload.reset
  if (payload.reset_close) return { ...prev, trustees: [] }

  // Otherwise merge in new state from payload
  const newState = merge({ ...prev }, { ...payload })

  // Print state changes to console
  const stateDiff = diff(prev, newState)
  if (Object.keys(stateDiff).length) {
    console.log('📝 State updated', stateDiff, newState)
  }

  return newState
}

// Export consumable hook that returns [state, dispatch]
export const useTrusteeState = ({ election_id, trustee_auth }: { election_id: string; trustee_auth: string }) =>
  useLocalStorageReducer(`keygen-${election_id}-${trustee_auth}`, reducer, { election_id, own_email: '', trustee_auth })

/** Helper function to create Parameter from state.parameters */
export function getParameters(state: State): Parameters {
  if (!state.parameters) throw new TypeError('Missing params')

  return {
    g: big(state.parameters.g),
    p: big(state.parameters.p),
    q: big(state.parameters.q),
  }
}
