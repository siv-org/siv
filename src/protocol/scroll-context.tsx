import { merge } from 'lodash'
import { createContext, useContext, useMemo, useReducer } from 'react'

import { Step, steps } from './steps'

// Skip "Before Election" milestone
const firstStep = (steps[1] as Step).name

const initState = { current: firstStep }

const reducer = (prev: State, payload: Payload) => merge({ ...prev }, payload)

type Map = Record<string, string>
type State = Map
type Payload = Map

const Context = createContext<{ dispatch: (payload: Payload) => void; state: State }>({
  dispatch: (payload: Payload) => void payload,
  state: initState,
})

export function ScrollContextProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(reducer, initState)
  const memoized = useMemo(() => ({ dispatch, state }), [dispatch, state])

  return <Context.Provider value={memoized}>{children}</Context.Provider>
}

export const useScrollContext = () => useContext(Context)
