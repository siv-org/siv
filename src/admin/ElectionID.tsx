import { useRouter } from 'next/router'
export const ElectionID = () => {
  const election_id = useElectionID()

  if (!election_id) return null

  return (
    <div>
      Election ID: {election_id}
      <style jsx>{`
        div {
          float: right;
          opacity: 0.5;

          position: relative;
          bottom: 37px;
        }
      `}</style>
    </div>
  )
}

export const useElectionID = () => useRouter().query.election_id
