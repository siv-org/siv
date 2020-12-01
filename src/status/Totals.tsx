export const Totals = ({ votes }: { votes: Record<string, string>[] }): JSX.Element => {
  const tallies: { [index: string]: { [index: string]: number } } = {}
  // Sum up votes
  votes.forEach((vote) => {
    Object.keys(vote).forEach((key) => {
      // Skip 'tracking' key
      if (key === 'tracking') return

      // Init item if new
      tallies[key] = tallies[key] || {}

      // Init selection if new
      tallies[key][vote[key]] = tallies[key][vote[key]] || 0

      // Increment by 1
      tallies[key][vote[key]]++
    })
  })

  // Sort from highest to lowest
  // const tuples = mapValues(vote_counts, (votes, name) => ({ name, votes }))
  // const ordered = orderBy(tuples, 'votes', 'desc')

  return (
    <div className="totals">
      <h3>Vote Totals:</h3>
      {Object.keys(tallies).map((item) => (
        <div key={item}>
          {Object.keys(tallies).length > 1 && <h4>On `{item}`</h4>}
          <ul>
            {Object.keys(tallies[item]).map((selection) => (
              <li key={selection}>
                {selection}: {tallies[item][selection]}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <style jsx>{`
        .totals {
          background: #f9f9f9;
          border: 2px solid #ddd;
          border-radius: 7px;
          padding: 1rem;
        }

        h3 {
          margin-top: 0;
        }
      `}</style>
    </div>
  )
}
