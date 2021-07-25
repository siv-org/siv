import { merge } from 'lodash-es'

import { ParametersString } from '../../pages/api/election/[election_id]/trustees/latest'
import { Parameters } from '../crypto/threshold-keygen'
import { big } from '../crypto/types'
import { useLocalStorageReducer } from '../vote/useLocalStorage'
import { diff } from './diff-objects'

// Define our types
type Cipher = { encrypted: string; unlock: string }
export type Shuffled = Record<string, { proof: unknown; shuffled: Cipher[] }>
export type Partial = {
  partial: string
  proof: {
    g_to_secret_r: string
    obfuscated_trustee_secret: string
    unlock_to_secret_r: string
  }
}

export type Trustee = {
  commitments: string[]
  email: string
  encrypted_pairwise_shares_for: Record<string, string>
  index: number
  name?: string
  partial_decryption?: string
  partials?: Record<string, Partial[]>
  preshuffled?: Record<string, Cipher[]> // admin only
  recipient_key?: string
  shuffled?: Shuffled
  verified?: Record<string, boolean>
  you?: boolean
}
export type State = {
  auth: string
  commitments?: string[]
  decrypted_shares_from?: Record<string, string>
  election_id: string
  encrypted_pairwise_shares_for?: Record<string, string>
  own_email: string
  own_index: number
  pairwise_randomizers_for?: Record<string, string>
  pairwise_shares_for?: Record<string, string>
  parameters?: ParametersString
  partial_decryption?: string
  personal_key_pair?: { decryption_key: string; public_key: { recipient: string } }
  private_coefficients?: string[]
  private_keyshare?: string
  threshold_public_key?: string
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
  if (payload.reset_unlock) return { ...prev, trustees: [] }

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
export const useTrusteeState = ({ auth, election_id }: { auth: string; election_id: string }) =>
  useLocalStorageReducer(`trustee-${election_id}-${auth}`, reducer, { auth, election_id, own_email: '' })

/** Helper function to create Parameter from state.parameters */
export function getParameters(state: State): Parameters {
  if (!state.parameters) throw new TypeError('Missing params')

  return {
    g: big(state.parameters.g),
    p: big(state.parameters.p),
    q: big(state.parameters.q),
  }
}
