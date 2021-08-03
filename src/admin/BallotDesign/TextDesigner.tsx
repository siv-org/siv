import { useStored } from '../useStored'

export const TextDesigner = ({ design, setDesign }: { design: string; setDesign: (s: string) => void }) => {
  const { ballot_design: storedBallotDesign } = useStored()

  const lineHeight = 17
  const padding = 8
  const height = design.split('\n').length * lineHeight + padding * 2

  return (
    <div className="container">
      <textarea
        disabled={!!storedBallotDesign}
        style={{ height }}
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
          padding: ${padding}px;
          resize: vertical;
          width: 100%;
          line-height: ${lineHeight}px;
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
