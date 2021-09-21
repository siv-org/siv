const debug = true

export const StepLabel = ({ step }: { step: number }) => {
  if (!debug) return null

  return <p>Step: {step}</p>
}
