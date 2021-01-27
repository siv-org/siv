import { useState } from 'react'

import { api } from '../../api-helper'
import { StageAndSetter } from '../AdminPage'
import { useElectionID } from '../ElectionID'
import { revalidate } from '../load-existing'
import { SaveButton } from '../SaveButton'

export const DesignInput = ({ stage }: StageAndSetter) => {
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
  const election_id = useElectionID()

  return (
    <>
      {error && <span className="error">⚠️ &nbsp;{error}</span>}
      <textarea
        id="ballot-design"
        value={ballot_design}
        onChange={(event) => {
          set_ballot_design(event.target.value)
          try {
            JSON.parse(event.target.value)
            setError(null)
          } catch (err) {
            console.log(err.message)
            setError(err.message)
          }
        }}
      />
      {stage === 2 && (
        <SaveButton
          onPress={async () => {
            const response = await api(`election/${election_id}/save-ballot-design`, {
              ballot_design,
              password: localStorage.password,
            })

            if (response.status === 201) {
              revalidate(election_id)
            } else {
              throw await response.json()
            }
          }}
        />
      )}

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
