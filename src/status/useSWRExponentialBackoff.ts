import { useEffect, useRef } from 'react'
import useSWR, { mutate } from 'swr'

/** Customize useSWR to revalidate using exponential backoff. 
Auto-resets if data changes. */
export function useSWRExponentialBackoff(
  key: Parameters<typeof useSWR>[0],
  fetcher: Parameters<typeof useSWR>[1],
  baseDelaySeconds: number,
) {
  const { data, error } = useSWR(key, fetcher)
  const retries = useRef(0)

  // Reset exponential delay when data or error changes
  useEffect(() => {
    retries.current = 0
  }, [JSON.stringify({ data, error })])

  // Exponential backoff loop
  useEffect(() => {
    let timerId: null | ReturnType<typeof setTimeout> = null

    function revalidate() {
      mutate(key)
      retries.current += 1
      const delay = baseDelaySeconds * 1000 * 2 ** retries.current
      timerId = setTimeout(revalidate, delay)
    }

    // Start the exponential backoff loop.
    revalidate()

    // Clear the interval when the component unmounts.
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [key, baseDelaySeconds])

  return { data, error }
}
