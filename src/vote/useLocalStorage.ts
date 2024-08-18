import { useEffect, useReducer } from 'react'

type ReducerParams = Parameters<typeof useReducer>

export const useLocalStorageReducer = (
  storage_key: string,
  reducer: ReducerParams[0],
  defaultValue: ReducerParams[1],
) => {
  const stored = localStorage.getItem(storage_key)
  let initial
  try {
    initial = stored ? JSON.parse(stored) : defaultValue
  } catch (error) {
    alert(`Error parsing localStorage: ${storage_key} — ${JSON.stringify(error)}`)
    throw error
  }
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    localStorage.setItem(storage_key, JSON.stringify(state))
  }, [storage_key, state])

  return [state, dispatch]
}
