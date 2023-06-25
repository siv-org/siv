import { useEffect } from 'react'
import useSWR, { mutate } from 'swr'

/** Customize useSWR to revalidate using exponential backoff. 
Auto-resets if data changes. */
export function useSWRExponentialBackoff(
  key: Parameters<typeof useSWR>[0],
  fetcher: Parameters<typeof useSWR>[1],
  baseDelaySeconds: number,
) {
  const { data, error } = useSWR(key, fetcher)

  useEffect(() => {
    let retries = 0
    let timerId: NodeJS.Timeout | null = null

    function revalidate() {
      mutate(key)
      retries += 1

      // Calculate delay using exponential backoff logic
      const delay = baseDelaySeconds * 1000 * 2 ** retries
      timerId = setTimeout(revalidate, delay)
    }

    revalidate()

    // Cleanup function to clear the interval
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [key, baseDelaySeconds, data, error])

  return { data, error }
}
