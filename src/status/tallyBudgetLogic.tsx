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

  // Find the right question
  const question = findBudgetQuestion(ballot_design, col)
  if (!question) return null
  const questionIndex = ballot_design.findIndex(({ id }) => id === question?.id)

  // Find the precalculated total budget allocated for this row
  const total = budgetSums[questionIndex][voteIndex]

  // If total === budget_allocated, return original
  if (total === Number(original)) return <span className="text-green-800">${original}</span>

  // Otherwise, we'll display normalized
  const factor = (question.budget_available || 0) / total
  const normalized = Number(original) * factor
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
