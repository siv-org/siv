import { useStored } from '../load-existing'

export const StoredManager = () => {
  const { election_manager } = useStored()

  return (
    <div>
      {election_manager || <i>Not set</i>}
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
