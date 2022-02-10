import { map, mapValues, merge } from 'lodash-es'
import { createContext, useContext, useMemo, useReducer } from 'react'
import { RP, random_bigint, stringToPoint } from 'src/crypto/curve'

import encrypt from '../crypto/encrypt'
import { candidates, public_key, voters } from './election-parameters'

const rand = () => RP.BASE.multiplyUnsafe(random_bigint()).toHex()
export const randEncrypted = () => `{ encrypted: ${rand()}, lock: ${rand()} }`

const initState = {
  encrypted: { auth: voters[0].auth },
  otherSubmittedVotes: voters.slice(1).map(({ auth }) => ({
    auth,
    mayor_vote: randEncrypted(),
    verification: randEncrypted(),
  })),
  plaintext: { mayor_vote: candidates[1], verification: '' },
  randomizer: {},
}

function reducer(prev: State, payload: Payload) {
  const newState = merge({ ...prev }, { plaintext: payload })

  // Encrypt values
  const randomizer: Partial<VoteMap> = {}
  const encrypted = mapValues(newState.plaintext as Record<string, string>, (value, key) => {
    const random = random_bigint()
    randomizer[key] = String(random)
    const cipher = encrypt(RP.fromHex(public_key), random, stringToPoint(value))

    return `{ \n${map(cipher, (v, k) => `${k}: ${v}`).join(',\n\t ')} \n}`
  })

  return merge(newState, { encrypted, randomizer })
}

// Boilerplate to be easier to use

type VoteMap = { [index: string]: string; mayor_vote: string; verification: string }
export type AuthedVote = VoteMap & { auth: string }
type State = {
  encrypted: Partial<AuthedVote>
  otherSubmittedVotes: AuthedVote[]
  plaintext: Partial<VoteMap>
  randomizer: Partial<VoteMap>
}

type Payload = Partial<VoteMap>

const Context = createContext<{ dispatch: (payload: Payload) => void; state: State }>({
  dispatch: (payload: Payload) => void payload,
  state: initState,
})

export function VoteContextProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const memoized = useMemo(() => ({ dispatch, state }), [dispatch, state])

  return <Context.Provider value={memoized}>{children}</Context.Provider>
}

export const useVoteContext = () => useContext(Context)
