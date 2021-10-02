import { useEffect, useRef, useState } from 'react'

const initStep = 0

export const useStepCounter = (maxStep: number) => {
  const [step, setStep] = useState(initStep)
  const interval = useRef<NodeJS.Timeout>()

  const clear = () => clearInterval(interval.current as NodeJS.Timeout)

  function startInterval() {
    // Clear any existing intervals
    clear()

    // Reset step count
    setStep(initStep)

    // Start new interval
    interval.current = setInterval(() => {
      setStep((s) => {
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
