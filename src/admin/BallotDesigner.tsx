import { useState } from 'react'

import { StageAndSetter } from './AdminPage'
import { SaveButton } from './SaveButton'

export const BallotDesigner = ({ set_stage, stage }: StageAndSetter) => {
  const [error, setError] = useState<string | null>()

  return (
    <>
      <h3>Ballot design: {error && <span className="error">⚠️ &nbsp;{error}</span>}</h3>
      <textarea
        defaultValue={`[
  {
    "title": "Who should become President?",
    "options": [
      { "name": "George H. W. Bush" },
      { "name": "Bill Clinton" },
      { "name": "Ross Perot" }
    ],
    "write_in_allowed": true
  }
]`}
        id="ballot-design"
        onChange={(event) => {
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
            await new Promise((res) => setTimeout(res, 1000))
            set_stage(stage + 1)
          }}
        />
      )}

      <style jsx>{`
        p {
          margin-bottom: 0px;
        }

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
