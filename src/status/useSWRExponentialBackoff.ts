import { useEffect } from 'react'
import useSWR, { mutate } from 'swr'

type Entry = {
  count: number
  retries: number
  timerId: null | ReturnType<typeof setTimeout>
}

const byKey = new Map<string, Entry>()

/** useSWR with exponential backoff. Auto-resets if data changes. Multiple callers share a single loop. */
export function useSWRExponentialBackoff(
  key: Parameters<typeof useSWR>[0],
  fetcher: Parameters<typeof useSWR>[1],
  baseDelaySeconds: number,
) {
  const { data, error } = useSWR(key, fetcher)

  // Reset exponential delay when data or error changes
  useEffect(() => {
    if (typeof key !== 'string') return
    const entry = getEntry(key)
    entry.retries = 0
  }, [key, JSON.stringify({ data, error })])

  // Exponential backoff loop
  useEffect(() => {
    if (typeof key !== 'string') return
    const entry = getEntry(key)
    entry.count += 1
    if (entry.count === 1) startPolling(key, entry, baseDelaySeconds)

    // Cleanup when last subscriber unmounts
    return () => {
      entry.count -= 1
      if (entry.count === 0) {
        if (entry.timerId) clearTimeout(entry.timerId)
        byKey.delete(key)
      }
    }
  }, [key, baseDelaySeconds])

  return { data, error }
}

function getEntry(key: string): Entry {
  // Get or create entry for this key
  let entry = byKey.get(key)
  if (!entry) {
    entry = { count: 0, retries: 0, timerId: null }
    byKey.set(key, entry)
  }
  return entry
}

function startPolling(
  key: Parameters<typeof useSWR>[0],
  entry: Entry,
  baseDelaySeconds: number,
) {
  // Run the exponential-backoff loop: mutate → schedule next
  function tick() {
    mutate(key)
    entry.retries += 1
    entry.timerId = setTimeout(tick, baseDelaySeconds * 1000 * 2 ** entry.retries)
  }
  tick()
}
