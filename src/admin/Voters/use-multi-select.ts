import { useEffect, useState } from 'react'

/** Logic for checkbox multi-select (holding shift) */
export const use_multi_select = () => {
  const [pressing_shift, set_shift] = useState(false)
  const [last_selected, set_last_selected] = useState<number>()
  function handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'Shift') set_shift(false)
  }
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Shift') set_shift(true)
  }
  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp, false)
    document.addEventListener('keydown', handleKeyDown, false)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return { last_selected, pressing_shift, set_last_selected }
}
