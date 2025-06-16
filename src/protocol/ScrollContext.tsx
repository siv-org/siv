import { merge } from 'lodash-es'
import { createContext, useContext, useMemo, useReducer } from 'react'

import { initStep } from './steps'

const initState = { current: initStep }

const reducer = (prev: State, payload: Payload) => merge({ ...prev }, payload)

type Map = Record<string, string>
type Payload = Map
type State = Map

const Context = createContext<{ dispatch: (payload: Payload) => void; state: State }>({
  dispatch: (payload: Payload) => void payload,
  state: initState,
})

export function ScrollContextProvider({ children }: { children: JSX.Element[] }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const memoized = useMemo(() => ({ dispatch, state }), [dispatch, state])

  return <Context.Provider value={memoized}>{children}</Context.Provider>
}

export const useScrollContext = () => useContext(Context)
