import { useState } from 'react'

import { useStored } from '../useStored'
import { check_for_ballot_errors } from './check_for_ballot_errors'

export const TextDesigner = ({
  ballot_design,
  set_ballot_design,
}: {
  ballot_design: string
  set_ballot_design: (b: string) => void
}) => {
  const [error, setError] = useState<string | null>()
  const { ballot_design: stored_ballot_design } = useStored()

  return (
    <div className="container">
      {error && <span className="error">⚠️ &nbsp;{error}</span>}
      <textarea
        disabled={!!stored_ballot_design}
        value={ballot_design}
        onChange={(event) => {
          set_ballot_design(event.target.value)
          setError(check_for_ballot_errors(event.target.value))
        }}
      />

      <style jsx>{`
        .container {
          flex: 1;
          position: relative;
          top: 3px;
        }

        textarea {
          border: 1px solid #ccc;
          border-radius: 4px;
          border-top-right-radius: 0;
          font-family: monospace;
          font-size: 12px;
          height: 200px;
          padding: 8px;
          resize: vertical;
          width: 100%;
          line-height: 17px;
        }

        textarea:focus {
          outline-width: 1px;
        }

        textarea:disabled:hover {
          background: #f8f8f8;
          cursor: not-allowed;
        }

        .error {
          border: 1px solid rgba(255, 0, 0, 0.44);
          background-color: #ffe5e6;
          padding: 2px 6px;
          border-radius: 4px;
          top: -26px;
          position: absolute;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
