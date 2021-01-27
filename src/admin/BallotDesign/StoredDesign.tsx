import { use_stored_info } from '../load-existing'

export const StoredDesign = () => {
  const { ballot_design } = use_stored_info()

  return (
    <div>
      {ballot_design || 'Error loading election'}
      <style jsx>{`
        div {
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          height: 200px;
          padding: 8px;
          resize: vertical;
          width: 100%;
          white-space: pre;
        }

        div:hover {
          background: #f8f8f8;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
