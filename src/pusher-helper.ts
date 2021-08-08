import Pusher from 'pusher-js'
import { useEffect } from 'react'
import useSWR, { mutate } from 'swr'

/** Pusher counts each initialization — `new Pusher()` — as one connection.
https://support.pusher.com/hc/en-us/articles/360019428173-How-are-connections-counted-
Also important not to initialize on SSR, those connections are never dropped (bc window never closes) */
export const pusher = typeof window !== 'undefined' ? new Pusher('9718ba0612df1a49e52b', { cluster: 'us3' }) : undefined
// Pusher.logToConsole = true

export const useData = (key: string, pusherChannel?: [string | undefined, string]) => {
  const [channelName, eventName] = pusherChannel || []

  // If given pusher channel & event names, revalidate on activity
  useEffect(() => {
    if (channelName && eventName) {
      if (!pusher) return alert('Pusher not initialized')

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

  const cacheKey = key.includes('undefined') ? null : `${window.location.origin}/api/${key}`

  return useSWR(cacheKey, (url: string) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw await r.json()
      return await r.json()
    }),
  ).data
}
