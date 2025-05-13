// These are for urgent errors where we want to disable the PointAndClick designer
export function check_for_fatal_ballot_errors(design: string): null | string {
  try {
    const parsed = JSON.parse(design)

    // Ballot must be an array
    if (!Array.isArray(parsed)) throw 'Must be an array'

    // Validate each question
    parsed.forEach((question) => {
      const id = question.id || 'vote'

      // 'verification' & 'tracking' are reserved IDs
      if (id === 'verification') throw `'verification' is a reserved ID`
      if (id === 'tracking') throw `'tracking' is a reserved ID`

      // Check each question has an options array
      if (!question.options || !Array.isArray(question.options))
        throw `Question ${question.id ? `'${question.id}'` : ''} is missing an options array`

      // Validate options
      question.options.forEach(({ name, value }: { name?: string; value?: string }) => {
        // Check for name field
        if (name === undefined || typeof name !== 'string') throw 'Each option should have a { name: string } field'

        // If value, keep short enough
        if (value && value.length > 26) throw `Keep "value" < 26 characters: ${value}`

        // If no value, name needs to be shorter
        if (!value && name.length > 26)
          throw `Name is too long. Add shorter "value" field, then longer name is ok: ${name}`

        // 'BLANK' is a reserved option
        if (name.toLowerCase() === 'blank') throw `'BLANK' is a reserved option name`

        // Check if the name is encodable (throws if input is outside our alphabet)
        new TextEncoder().encode(name)
      })
    })
  } catch (e) {
    if (typeof e === 'string') return e
    if (e instanceof Error) return e.message
    throw e
  }
  return null
}

// These are for less urgent errors we only need to check for on Save.
export function check_for_less_urgent_ballot_errors(design: string): null | string {
  try {
    const parsed = JSON.parse(design)

    if (!Array.isArray(parsed)) throw 'Must be an array'

    // Validate each question
    const ids: Record<string, boolean> = {}
    parsed.forEach((question) => {
      // Check for duplicate IDs
      const id = question.id || 'vote'
      if (ids[id]) throw `Each question must have a unique ID: ${id}`
      ids[id] = true

      // Validate options
      const optionsSeen: Record<string, boolean> = {}
      question.options.forEach(({ name = '' }: { name?: string }, oIndex: number) => {
        if (name === '') throw `Can't have empty options. Fix \`${id}\` option #${oIndex + 1}`

        // Check no duplicate options (case insensitive)
        if (optionsSeen[name.toLowerCase()])
          throw `Question ${question.id ? `'${question.id}'` : ''} has duplicate option: ${name}`
        optionsSeen[name.toLowerCase()] = true
      })
    })
  } catch (e) {
    if (typeof e === 'string') return e
    if (e instanceof Error) return e.message
    throw e
  }
  return null
}
