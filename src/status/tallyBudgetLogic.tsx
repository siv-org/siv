import { Tooltip } from 'src/admin/Voters/Tooltip'
import { Item } from 'src/vote/storeElectionInfo'

/** Find the original ballot_design id for a given column */
export function findBudgetQuestion(ballot_design: Item[], col: string) {
  // Check for matching ballot types = 'budget'
  const possibleItem = ballot_design.find(({ id = 'vote', type }) => type === 'budget' && col.startsWith(id))
  if (!possibleItem) return false

  // If found, check if col is in options
  const matchingCol = possibleItem.options.find(({ name, value }) => col.endsWith(value || name))

  if (matchingCol) return possibleItem
}

function invalidBudgetValues(vote: string): string {
  if (Number(vote) < 0) return 'Negative amounts not allowed'
  if (Number.isNaN(Number(vote))) return 'Not a number'
  if (Number(vote) === Infinity) return "Can't normalize Infinity"
  return ''
}

export function sumBudgetVotes(votes: Record<string, string>[], ballot_design: Item[]) {
  // For all budget questions
  return ballot_design.map(({ id = 'vote', options, type }) => {
    // Stop if question isn't a budget item
    if (type !== 'budget') return []

    // Otherwise, for every submission (row in table)
    return votes.map((vote) => {
      // Add up their total budget allocated
      let total = 0
      options.forEach(({ name, value }) => {
        const cell = vote[id + '_' + value || name]

        // Filter out invalid entries
        if (invalidBudgetValues(cell)) return

        total += Number(cell)
      })
      return total
    })
  })
}

function calculateFactor(
  ballot_design: Item[],
  budgetSums: number[][],
  col: string,
  original: string,
  voteIndex: number,
) {
  // Find the right question
  const question = findBudgetQuestion(ballot_design, col)
  if (!question) return {}
  const questionIndex = ballot_design.findIndex(({ id }) => id === question?.id)

  // Find the precalculated total budget allocated for this row
  const total = budgetSums[questionIndex][voteIndex]

  // Calculate factor to display normalized
  const factor = (question.budget_available || 0) / total
  const normalized = Number(original) * factor

  return { factor, normalized, question, total }
}

export function BudgetEntry({
  ballot_design,
  budgetSums,
  col,
  original,
  voteIndex,
}: {
  ballot_design: Item[]
  budgetSums: number[][]
  col: string
  original: string
  voteIndex: number
}) {
  // Handle blanks
  if (!original) return null

  // Handle invalid entries
  const error = invalidBudgetValues(original)
  if (error)
    return (
      <Tooltip tooltip={error}>
        <span className="text-red-500 border-0 border-b border-red-500 border-dashed opacity-70">{original}</span>
      </Tooltip>
    )

  // Calculate factor
  const { factor, normalized, question, total } = calculateFactor(ballot_design, budgetSums, col, original, voteIndex)

  if (normalized === 0) return <span className="opacity-30">{normalized}</span>

  // If total === budget_allocated, return original
  if (normalized === Number(original)) return <span className="text-green-800">${original}</span>

  if (!factor) return null

  return (
    <Tooltip
      tooltip={
        <span className="text-black/50">
          Row total: <span className="text-black/80">${total}</span> of ${question.budget_available}. Scaling by{' '}
          <span className="font-semibold text-green-800">{factor.toFixed(2)}</span>
        </span>
      }
    >
      <div>
        <span className="opacity-80">{original}</span>
        <span className="opacity-40"> → </span>
        <span className="text-green-800 border-0 border-b border-dashed border-green-800/70 ">
          ${Math.floor(normalized)}
        </span>
      </div>
    </Tooltip>
  )
}

export function BudgetsAveraged({
  ballot_design,
  budgetSums,
  columns,
  sorted_votes,
}: {
  ballot_design: Item[]
  budgetSums: number[][]
  columns: string[]
  sorted_votes: Record<string, string>[]
}) {
  // If no budget questions, show nothing
  if (!budgetSums.some((votes) => votes.length > 0)) return null

  // Calculate normalized average for each column
  const averages = columns.map((col) => {
    let sum = 0
    sorted_votes.forEach((vote, voteIndex) => {
      if (!vote[col]) return
      if (invalidBudgetValues(vote[col])) return

      const original = vote[col]
      // Get normalized
      const { normalized } = calculateFactor(ballot_design, budgetSums, col, original, voteIndex)

      sum += normalized || 0
    })

    sum /= sorted_votes.length
    return sum
  })

  return (
    <tr className="border-0 border-b-2 border-solid border-blue-900/20">
      <td className="italic opacity-70">Avg</td>
      <td></td>
      {columns.map((col, colIndex) => (
        <td className="text-center" key={col}>
          {averages[colIndex] === 0 ? (
            <span className="opacity-20">0</span>
          ) : (
            <Tooltip
              tooltip={
                <span>
                  Mean of <span className="font-semibold text-green-800">normalized</span> amounts below{' '}
                  <span className="opacity-50">(blanks = 0)</span>
                </span>
              }
            >
              <span className="font-semibold text-green-800">${Math.floor(averages[colIndex])}</span>
            </Tooltip>
          )}
        </td>
      ))}
    </tr>
  )
}
