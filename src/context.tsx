import { useContext as _useContext, createContext, useMemo, useReducer } from 'react'

const initState = { vote_for_mayor: 'London Breed' }
type State = Record<string, string>

const Context = createContext<{ dispatch: (payload: State) => void; state: State }>({
  dispatch: (payload: State) => void payload,
  state: initState,
})

export default function ContextProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer((prev: State, payload: State) => ({ ...prev, ...payload }), initState)
  const memoized = useMemo(() => ({ dispatch, state }), [dispatch, state])

  return <Context.Provider value={memoized}>{children}</Context.Provider>
}

export const useContext = () => _useContext(Context)
