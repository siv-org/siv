import { merge } from 'lodash-es'
import { stringifyPartial } from 'src/crypto/stringify-partials'
import { CipherStrings, stringifyShuffle } from 'src/crypto/stringify-shuffle'

import { useLocalStorageReducer } from '../vote/useLocalStorage'
import { diff } from './diff-objects'

export type Dispatch = ReturnType<typeof useLocalStorageReducer>[1]
export type PartialWithProof = { partial: string; proof: ReturnType<typeof stringifyPartial> }
export type Shuffled = Record<string, ReturnType<typeof stringifyShuffle>>
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
  partial_decryption?: string
  personal_key_pair?: { decryption_key: string; public_key: string }
  private_coefficients?: string[]
  private_keyshare?: string
  t?: number
  threshold_public_key?: string
  trustees?: Trustee[]
  verified?: Record<string, boolean>
}

/**
 * Typescript helper w/ State and Dispatch
 * @property dispatch - Takes {key: value} and sticks it in local storage
 * @property state - The current state, persisted in localstorage against refreshes, window closes, etc
 */
export type StateAndDispatch = {
  dispatch: Dispatch
  state: State
}

export type Trustee = {
  commitments: string[]
  email: string
  encrypted_pairwise_shares_for: Record<string, string>
  index: number
  name?: string
  partial_decryption?: string
  preshuffled?: Record<string, CipherStrings[]> // admin only
  recipient_key?: string
  verified?: Record<string, boolean>
  you?: boolean
}

/** Core state logic */
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

/** Export consumable hook that returns [state, dispatch] */
export const useTrusteeState = ({
  attempt,
  auth,
  election_id,
}: {
  attempt: number
  auth: string
  election_id: string
}) =>
  useLocalStorageReducer(`observer-${election_id}-${auth}-${attempt}`, reducer, { auth, election_id, own_email: '' })
