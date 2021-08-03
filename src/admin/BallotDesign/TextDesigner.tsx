import { useStored } from '../useStored'

export const TextDesigner = ({ design, setDesign }: { design: string; setDesign: (s: string) => void }) => {
  const { ballot_design: storedBallotDesign } = useStored()

  return (
    <div className="container">
      <textarea
        disabled={!!storedBallotDesign}
        value={design}
        onChange={(event) => {
          setDesign(event.target.value)
        }}
      />

      <style jsx>{`
        .container {
          flex: 1;
          position: relative;
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
      `}</style>
    </div>
  )
}
