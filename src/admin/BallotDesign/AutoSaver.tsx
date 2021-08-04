import { debounce } from 'lodash-es'
import { useEffect, useState } from 'react'

import { api } from '../../api-helper'
import { useStored } from '../useStored'

export const AutoSaver = ({ design }: { design: string }) => {
  const [unsaved, setUnsaved] = useState(false)
  const { election_id } = useStored()

  const debouncedSaveDraft = debounce(
    async () => {
      const response = await api(`election/${election_id}/admin/save-ballot-design`, { ballot_design: design })

      if (response.status !== 201) return alert(JSON.stringify(await response.json()))
      setUnsaved(false)
    },
    500,
    { trailing: true },
  )

  // Whenever design changes...
  useEffect(() => {
    setUnsaved(true)
    // Set a debounce to autosave after 1 second
    debouncedSaveDraft()
  }, [design])

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
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
