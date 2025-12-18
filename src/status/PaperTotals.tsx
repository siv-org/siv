export const PaperTotals = ({
  paper_totals,
  paper_votes,
}: {
  paper_totals?: Record<string, number>
  paper_votes?: Record<string, string>[]
}) => {
  if (!paper_totals) return null

  const num_paper_votes = paper_votes?.length

  const sorted_paper_totals = Object.entries(paper_totals).sort((a, b) => b[1] - a[1])

  return (
    <div className="p-4 mt-4 bg-white rounded-lg shadow-[0px_1px_2px_hsl(0_0%_50%/_0.333),0px_3px_4px_hsl(0_0%_50%/_0.333),0px_4px_6px_hsl(0_0%_50%/_0.333)]">
      <div className="mt-3 font-bold">
        {paper_votes ? (
          // Link to #paper-ballots if we have them
          <a className="text-black/90" href="#paper-ballots">
            Additional Paper Totals:
          </a>
        ) : (
          'Additional Paper Totals:'
        )}
      </div>

      <ul>
        {sorted_paper_totals.map(([key, value]) => (
          <li key={key}>
            {key}: {value}{' '}
            {num_paper_votes ? (
              <span className="ml-1 opacity-50 text-[12px]">({((100 * value) / num_paper_votes).toFixed(1)}%)</span>
            ) : (
              ''
            )}
          </li>
        ))}
      </ul>

      <style global jsx>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
