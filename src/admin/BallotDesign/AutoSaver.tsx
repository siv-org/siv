import { debounce } from 'lodash-es'
import { useEffect, useState } from 'react'

import { api } from '../../api-helper'
import { useStored } from '../useStored'

export const AutoSaver = ({ design }: { design: string }) => {
  const [saved, setSaved] = useState(false)
  const { election_id } = useStored()

  const secondsVisible = 2

  const debouncedSaveDraft = debounce(async () => {
    const response = await api(`election/${election_id}/admin/save-ballot-design`, { ballot_design: design })

    if (response.status !== 201) return alert(JSON.stringify(await response.json()))

    setSaved(true)
    setTimeout(() => setSaved(false), secondsVisible * 1000)
  }, 2000)

  // Whenever design changes...
  useEffect(() => {
    // Set a debounce to autosave after 1 second
    debouncedSaveDraft()
  }, [design])

  return (
    <div>
      <span className={saved ? 'visible' : ''}>Saved.</span>
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
        }

        .visible {
          animation: fadein ${secondsVisible}s;
        }

        @keyframes fadein {
          0% {
            opacity: 0;
          }
          5% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
