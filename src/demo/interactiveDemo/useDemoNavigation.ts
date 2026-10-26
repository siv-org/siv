import { useRouter } from 'next/router'
import { useCallback } from 'react'

const STEPS = ['intro', 'invite', 'results', 'submitted', 'vote'] as const
export type Step = (typeof STEPS)[number]

// Accept only known steps when restoring a saved demo.
export const isStep = (value: unknown): value is Step => STEPS.some((step) => step === value)

export function useDemoNavigation() {
  const router = useRouter()

  // Read the step from the URL, including when Back or Forward changes it.
  const urlStep = 'vote-submitted' in router.query ? 'submitted' : STEPS.find((name) => name in router.query)
  const step = urlStep || 'intro'

  const setStep = useCallback(
    (next: Step, history: 'push' | 'replace' = 'push') => {
      if (history === 'push' && next === step) return

      // Swap the step in the URL; keep any unrelated query parameters.
      const query = new URLSearchParams(window.location.search)
      STEPS.forEach((name) => query.delete(name))
      query.delete('vote-submitted')
      query.delete('step')
      const otherParams = query.toString()
      const url = `${router.pathname}?${next === 'submitted' ? 'vote-submitted' : next}${
        otherParams ? `&${otherParams}` : ''
      }`

      // Push adds a Back-button stop; replace updates the current stop.
      // Keep the demo mounted and let it handle scrolling.
      void router[history](url, undefined, { scroll: false, shallow: true })
    },
    [router, step],
  )

  return { isReady: router.isReady, setStep, step, urlStep }
}
