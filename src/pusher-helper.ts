import Pusher from 'pusher-js'
import { useEffect } from 'react'
import useSWR, { mutate } from 'swr'

/** Pusher counts each initialization — `new Pusher()` — as one connection.
https://support.pusher.com/hc/en-us/articles/360019428173-How-are-connections-counted-
Lazy singleton: only connect on first subscribe, not merely by importing this module. */
let client: Pusher | undefined
export function getPusher() {
  if (typeof window === 'undefined') return // Important not to initialize on SSR — those connections are never dropped (bc window never closes)
  if (!client) client = new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' })
  // Pusher.logToConsole = true
  return client
}

export const useData = (key: string, pusherChannel?: [string | undefined, string]) => {
  const [channelName, eventName] = pusherChannel || []

  // If given pusher channel & event names, revalidate on activity
  useEffect(() => {
    if (channelName && eventName) {
      const pusher = getPusher()
      if (!pusher) return

      // Subscribe to channel
      const channel = pusher.subscribe(channelName)
      // console.log('Subscribed to', channelName)
      channel.bind(eventName, () => {
        console.log(`🆕 ${channelName} - ${eventName}`)
        mutate(cacheKey)
      })

      return () => {
        // console.log('Unsubscribing from', channelName)
        channel.unbind()
      }
    }
  }, [channelName, eventName])

  const cacheKey =
    typeof window === 'undefined' || key.includes('undefined') ? null : `${window.location.origin}/api/${key}`

  return useSWR(cacheKey, (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) {
        const errorData = await r.json().catch(() => ({ error: `HTTP ${r.status}: ${r.statusText}` }))
        throw new Error(errorData.error || `Failed to load: ${r.status}`)
      }
      return await r.json()
    }),
  )
}
