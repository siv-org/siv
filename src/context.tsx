import { map, mapValues, merge } from 'lodash'
import { useContext as _useContext, createContext, useMemo, useReducer } from 'react'

import { encode } from './protocol/crypto/encode'
import encrypt from './protocol/crypto/encrypt'
import pickRandomInteger from './protocol/crypto/pick-random-integer'
import { Big, big } from './protocol/crypto/types'
import { candidates, public_key } from './protocol/election-parameters'

const initState = {
  encrypted: {},
  plaintext: { secret: '', vote_for_mayor: candidates[1] },
  randomizer: {},
  yOffset: {},
}

type Map = Record<string, string>
type State = { encrypted: Map; plaintext: Map; randomizer: Map; yOffset: Map }

type Payload = Map | { yOffset: Map }

const Context = createContext<{ dispatch: (payload: Payload) => void; state: State }>({
  dispatch: (payload: Payload) => void payload,
  state: initState,
})

export default function ContextProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const memoized = useMemo(() => ({ dispatch, state }), [dispatch, state])

  return <Context.Provider value={memoized}>{children}</Context.Provider>
}

export const useContext = () => _useContext(Context)

function reducer(prev: State, payload: Payload) {
  // Are we updating yOffset values?
  if (payload.yOffset) {
    return merge({ ...prev }, payload)
  }

  // Otherwise we must be updating vote plaintext
  const newState = merge({ ...prev }, { plaintext: payload })

  // Encrypt values
  const randomizer: Map = {}
  const encrypted = mapValues(newState.plaintext, (value, key) => {
    const random = pickRandomInteger(public_key.modulo)
    randomizer[key] = random.toString()
    const cipher = encrypt(public_key, random, big(encode(value)))

    return `{ ${map(cipher, (value: Big, key) => `${key}: ${value.toString()}`).join(', ')} }`
  })

  return merge(newState, { encrypted, randomizer })
}
