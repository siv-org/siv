import { multi_vote_regex } from '../../status/tally-votes'
import { Item } from '../storeElectionInfo'

/** Decode encoded plaintext back to original selection */
export function decodePlaintext(encoded: string, questionId: string, ballotDesign: Item[]): string {
  if (encoded === 'b') return 'BLANK'

  // If it's a write-in, remove "w:" prefix
  if (encoded.startsWith('w:')) return encoded.slice(2)

  if (!ballotDesign) return 'MissingBallotDesign'

  // If it's an indexed option, consult ballot design
  if (encoded.startsWith('i')) {
    const index = Number.parseInt(encoded.slice(1), 10)
    if (isNaN(index)) return encoded // Invalid format, return as-is

    // Find the question
    const multiSuffix = questionId.match(multi_vote_regex)
    let baseQuestionId =
      multiSuffix && !ballotDesign.find((item) => item.id === questionId)
        ? questionId.slice(0, -multiSuffix[0].length)
        : questionId

    // For score/budget, the column format is "questionId_optionName", extract base questionId
    let question = ballotDesign.find((item) => item.id === baseQuestionId)
    if (!question) {
      // Try to find by matching prefix (for score/budget voting: "vote_Chocolate" -> "vote")
      question = ballotDesign.find((item) => {
        if (!item.id) return false
        return baseQuestionId.startsWith(item.id + '_')
      })
      if (question) baseQuestionId = question.id || baseQuestionId
    }

    if (!question || index < 0 || index >= question.options.length) return encoded

    const option = question.options[index]

    // Return the value if available, otherwise the name
    return option.value || option.name
  }

  // Otherwise, it's a score or special value, keep as-is
  return encoded
}

/**
 * Encode plaintext selection compactly:
 * - If matches an option: encode as "i{index}" (0-based)
 * - If "BLANK": encode as "b"
 * - Otherwise: encode as "w:{plaintext}" for write-ins, or keep as-is for scores/special values
 */
export function encodePlaintext(plaintext: string, questionId: string, ballotDesign: Item[]): string {
  if (plaintext === 'BLANK') return 'b'

  if (!ballotDesign) return `w:${plaintext}`

  // Find the question in ballot design
  // Handle multi-vote format (e.g., "president_1" -> "president")
  // Handle score/budget format (e.g., "vote_Chocolate" -> "vote")
  const multiSuffix = questionId.match(multi_vote_regex)
  let baseQuestionId =
    multiSuffix && !ballotDesign.find((item) => item.id === questionId)
      ? questionId.slice(0, -multiSuffix[0].length)
      : questionId

  // For score/budget, the column format is "questionId_optionName", extract base questionId
  let question = ballotDesign.find((item) => item.id === baseQuestionId)
  if (!question && (baseQuestionId.includes('_') || baseQuestionId.includes('-'))) {
    // Try to find by matching prefix (for score/budget voting)
    question = ballotDesign.find((item) => {
      if (!item.id) return false
      return baseQuestionId.startsWith(item.id + '_') || baseQuestionId.startsWith(item.id + '-')
    })
    if (question) baseQuestionId = question.id || baseQuestionId
  }

  if (!question) return `w:${plaintext}`

  // For score/budget voting, numeric strings are valid and should be kept as-is
  if ((question.type === 'score' || question.type === 'budget') && /^\d+$/.test(plaintext)) return plaintext

  // Check if plaintext matches any option (check both value and name)
  // Use original order (not shuffled)
  const optionIndex = question.options.findIndex((option) => {
    // Check if plaintext matches the option value or name
    return (option.value || option.name) === plaintext
  })
  if (optionIndex >= 0) return `i${optionIndex}`

  // Otherwise, treat as write-in
  return `w:${plaintext}`
}
