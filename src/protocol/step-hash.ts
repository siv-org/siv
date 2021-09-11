import { groupedSteps } from './steps'

export const stepHash: Record<string, string> = {}

// Pre steps: pre-a, pre-b...
groupedSteps[0].steps.forEach(({ name }, index) => {
  stepHash[name] = `pre-${'abc'[index]}`
})

// Main steps: 1, 2...
;[...groupedSteps[1].steps, ...groupedSteps[2].steps].forEach(({ name }, index) => {
  stepHash[name] = String(index + 1)
})
