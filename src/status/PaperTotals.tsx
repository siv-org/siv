export const PaperTotals = ({ paper_totals }: { paper_totals?: Record<string, number> }) => {
  if (!paper_totals) return null

  const sorted_paper_totals = Object.entries(paper_totals).sort((a, b) => b[1] - a[1])

  return (
    <div className="p-4 mt-4 bg-white rounded-lg shadow-[0px_1px_2px_hsl(0_0%_50%/_0.333),0px_3px_4px_hsl(0_0%_50%/_0.333),0px_4px_6px_hsl(0_0%_50%/_0.333)]">
      <div className="mt-3 font-bold">Additional Paper Totals:</div>

      <ul>
        {sorted_paper_totals.map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  )
}
