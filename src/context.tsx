import { merge } from 'lodash'
import { useContext as _useContext, createContext, useMemo, useReducer } from 'react'

import { encode } from './crypto/encode'
import encrypt from './crypto/encrypt'
import pickRandomInteger from './crypto/pick-random-integer'
import { public_key } from './crypto/sample-key'
import { big, stringify } from './crypto/types'

const initState = { encrypted: {}, plaintext: { vote_for_mayor: 'London Breed' } }
type Map = Record<string, string>
type State = { encrypted: Map; plaintext: Map }

const Context = createContext<{ dispatch: (payload: Map) => void; state: State }>({
  dispatch: (payload: Map) => void payload,
  state: initState,
})

export default function ContextProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const memoized = useMemo(() => ({ dispatch, state }), [dispatch, state])

  return <Context.Provider value={memoized}>{children}</Context.Provider>
}

export const useContext = () => _useContext(Context)

function reducer(prev: State, payload: Map) {
  const newPlaintext = merge({ ...prev }, { plaintext: payload })
  const result = merge(newPlaintext, { encrypted: encryptValues(newPlaintext.plaintext) })
  return result
}

function encryptValues(object: Map) {
  const encrypted: Map = {}
  Object.keys(object).map((key) => {
    encrypted[key] = stringify(encrypt(public_key, pickRandomInteger(public_key.modulo), big(encode(object[key]))))
  })

  return encrypted
}
