import { encode } from '../../crypto/encode'

// These are for urgent errors where we want to disable the PointAndClick designer
export function check_for_urgent_ballot_errors(design: string): string | null {
  try {
    const parsed = JSON.parse(design)

    // Ballot must be an array
    if (!Array.isArray(parsed)) throw 'Must be an array'

    // Validate each question
    const ids: Record<string, boolean> = {}
    parsed.forEach((question) => {
      // Check for duplicate IDs
      const id = question.id || 'vote'
      if (ids[id]) throw 'Each question must have a unique ID'
      ids[id] = true

      // 'verification' & 'tracking' are reserved IDs
      if (id === 'verification') throw `'verification' is a reserved ID`
      if (id === 'tracking') throw `'tracking' is a reserved ID`

      // Check each question has an options array
      if (!question.options || !Array.isArray(question.options))
        throw `Question ${question.id ? `'${question.id}'` : ''} is missing an options array`

      // Validate options
      const options: Record<string, boolean> = {}
      question.options.forEach(({ name }: { name?: string }) => {
        // Check for name field
        if (name === undefined || typeof name !== 'string') throw 'Each option should have a { name: string } field'

        // Make sure name field isn't too long.
        if (name.length > 26) throw `Keep names under 26 characters: ${name}`

        // 'BLANK' is a reserved option
        if (name.toLowerCase() === 'blank') throw `'BLANK' is a reserved option name`

        // Check no duplicate options (case insensitive)
        if (options[name.toLowerCase()])
          throw `Question ${question.id ? `'${question.id}'` : ''} has duplicate option: ${name}`
        options[name.toLowerCase()] = true

        // Check if the name is encodable (throws if input is outside our alphabet)
        encode(name)
      })
    })
  } catch (e) {
    return e.message || e
  }
  return null
}

// These are for less urgent errors we only need to check for on Save.
export function check_for_less_urgent_ballot_errors(design: string): string | null {
  try {
    const parsed = JSON.parse(design)

    if (!Array.isArray(parsed)) throw 'Must be an array'

    // Validate each question
    parsed.forEach((question) => {
      // Validate options
      question.options.forEach(({ name }: { name?: string }) => {
        if (name === '') throw `Can't have empty options`
      })
    })
  } catch (e) {
    return e.message || e
  }
  return null
}
