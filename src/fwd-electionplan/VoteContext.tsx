import { map, mapValues, merge } from 'lodash-es'
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { random_bigint, RP, stringToPoint } from 'src/crypto/curve'
import { generateTrackingNum } from 'src/vote/tracking-num'

import encrypt from '../crypto/encrypt'
import { public_key, voters } from './election-parameters'

const rand = () => RP.BASE.multiplyUnsafe(random_bigint()).toHex()
export const randEncrypted = () => `{ encrypted: ${rand()}, lock: ${rand()} }`

// Lazy load voters to avoid SSR mismatch
const getVoters = () => (typeof window !== 'undefined' ? voters : [])
const getPublicKey = () => (typeof window !== 'undefined' ? public_key : '')

const getInitState = () => {
  const clientVoters = getVoters()
  return {
    encrypted: { auth: clientVoters[0]?.auth || '' },
    otherSubmittedVotes: clientVoters.slice(1).map(({ auth }) => ({
      auth,
      mayor_vote: randEncrypted(),
    })),
    plaintext: {},
    randomizer: {},
    verification: generateTrackingNum(),
  }
}

const emptyInitState = {
  encrypted: { auth: '' },
  otherSubmittedVotes: Array(4)
    .fill(null)
    .map(() => ({
      auth: '',
      mayor_vote: '',
    })),
  plaintext: {},
  randomizer: {},
  verification: '',
}

export type AuthedVote = VoteMap & { auth: string }
type Payload = Partial<VoteMap>
type State = {
  encrypted: Partial<AuthedVote>
  otherSubmittedVotes: AuthedVote[]
  plaintext: Partial<VoteMap>
  randomizer: Partial<VoteMap>
  verification: string
}
type VoteMap = { [index: string]: string; mayor_vote: string }

function reducer(prev: State, payload: Payload | { type: 'INIT' }) {
  if ('type' in payload && payload.type === 'INIT') {
    return getInitState()
  }

  const verification = generateTrackingNum()
  const newState = merge({ ...prev }, { plaintext: payload as Payload, verification })

  // Encrypt values
  const randomizer: Partial<VoteMap> = {}
  const clientPublicKey = getPublicKey()
  const encrypted = mapValues(newState.plaintext as Record<string, string>, (value, key) => {
    const random = random_bigint()
    randomizer[key] = String(random)
    const cipher = encrypt(RP.fromHex(clientPublicKey || public_key), random, stringToPoint(`${verification}:${value}`))

    return `{ \n${map(cipher, (v, k) => `${k}: ${v}`).join(',\n\t ')} \n}`
  })

  return merge(newState, { encrypted, randomizer })
}

const Context = createContext<{ dispatch: (payload: Payload | { type: 'INIT' }) => void; state: State }>({
  dispatch: (payload: Payload | { type: 'INIT' }) => void payload,
  state: emptyInitState,
})

export function VoteContextProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(reducer, emptyInitState)
  const initialized = useRef(false)
  const memoized = useMemo(() => ({ dispatch, state }), [dispatch, state])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      dispatch({ type: 'INIT' })
    }
  }, [])

  return <Context.Provider value={memoized}>{children}</Context.Provider>
}

export const useVoteContext = () => useContext(Context)
