import { debounce } from 'lodash-es'
import { useEffect, useState } from 'react'

import { api } from '../../api-helper'
import { useStored } from '../useStored'

export const AutoSaver = ({ design }: { design: string }) => {
  const [unsaved, setUnsaved] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const { election_id } = useStored()

  const debouncedSaveDraft = debounce(
    async () => {
      const response = await api(`election/${election_id}/admin/save-ballot-design`, { ballot_design: design })

      if (response.status !== 201) return alert(`Error: ${(await response.json()).error}`)
      setUnsaved(false)
    },
    500,
    { trailing: true },
  )

  // Whenever design changes...
  useEffect(() => {
    if (!election_id) return
    if (firstLoad) return setFirstLoad(false)
    setUnsaved(true)
    // Set a debounce to autosave after 1 second
    debouncedSaveDraft()
  }, [design, election_id])

  return (
    <div>
      <span className={unsaved ? 'visible' : ''}>Saving...</span>
      <style jsx>{`
        div {
          position: relative;
        }
        span {
          padding: 3px 5px;
          border-radius: 10px;
          position: absolute;
          left: -4px;
          font-size: 12px;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .visible {
          opacity: 0; // Disabled
        }
      `}</style>
    </div>
  )
}
