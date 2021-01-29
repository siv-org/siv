import { use_stored_info } from '../load-existing'

export const StoredTitle = () => {
  const { election_title } = use_stored_info()

  return (
    <div>
      {election_title || 'Error loading election'}
      <style jsx>{`
        div {
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          padding: 8px;
          width: 100%;
        }

        div:hover {
          background: #f8f8f8;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
