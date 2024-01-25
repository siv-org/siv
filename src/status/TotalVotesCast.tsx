export const TotalVotesCast = ({ numVotes }: { numVotes: number }) => {
  return (
    <div className="inline-block px-2 py-1 mb-4 text-center bg-blue-200 shadow rounded-xl text-black/60">
      Total votes cast: <span className="font-semibold text-black/90">{numVotes}</span>
    </div>
  )
}
