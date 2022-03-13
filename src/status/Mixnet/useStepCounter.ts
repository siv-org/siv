import { useEffect, useRef, useState } from 'react'

export const useStepCounter = (initStep: number, maxStep: number, onStep: (step: number) => void) => {
  const [step, setStep] = useState(initStep)
  const interval = useRef<NodeJS.Timeout>()

  const clear = () => clearInterval(interval.current as NodeJS.Timeout)

  function startInterval() {
    // Clear any existing intervals
    clear()

    // Reset step count
    setStep(initStep)

    // Start new interval
    interval.current = global.setInterval(() => {
      setStep((s) => {
        onStep(s)
        if (s >= maxStep) {
          clear()
          return s
        }
        return s + 1
      })
    }, 1000)
  }

  useEffect(() => {
    startInterval()

    return clear
  }, [maxStep])

  return { startInterval, step }
}
