import router from 'next/router'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'

export const DesignInput = () => {
  const [error, setError] = useState<string | null>()
  const [ballot_design, set_ballot_design] = useState(`[
  {
    "title": "Who should become President?",
    "options": [
      { "name": "George H. W. Bush" },
      { "name": "Bill Clinton" },
      { "name": "Ross Perot" }
    ],
    "write_in_allowed": true
  }
]`)
  const { election_id } = useStored()

  return (
    <>
      {error && <span className="error">⚠️ &nbsp;{error}</span>}
      <textarea
        id="ballot-design"
        value={ballot_design}
        onChange={(event) => {
          set_ballot_design(event.target.value)
          try {
            const parsed = JSON.parse(event.target.value)

            // Ballot must be an array
            if (!Array.isArray(parsed)) throw 'Must be an array'

            const ids: Record<string, boolean> = {}
            parsed.forEach((question) => {
              // Ensure there are no duplicate IDs
              const id = question.id || 'vote'
              if (ids[id]) throw 'Each question must have a unique ID'
              ids[id] = true

              // Ensure each question has an options array
              if (!question.options || !Array.isArray(question.options))
                throw `Question ${question.id ? `'${question.id}'` : ''} is missing an options array`

              // Ensure no question has duplicate options
            })

            // Passed validation
            setError(null)
          } catch (err) {
            console.warn(err)
            setError(err.message || err)
          }
        }}
      />
      <SaveButton
        onPress={async () => {
          const response = await api(`election/${election_id}/admin/save-ballot-design`, { ballot_design })

          if (response.status === 201) {
            revalidate(election_id)
            router.push(`${window.location.origin}/admin/${election_id}/voters`)
          } else {
            throw await response.json()
          }
        }}
      />

      <style jsx>{`
        textarea {
          border-color: #ccc;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          height: 200px;
          padding: 8px;
          resize: vertical;
          width: 100%;
          line-height: 17px;
        }

        .error {
          border: 1px solid rgba(255, 0, 0, 0.44);
          background-color: rgba(255, 183, 183, 0.283);
          padding: 2px 6px;
          border-radius: 4px;
          bottom: 5px;
          position: relative;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}
