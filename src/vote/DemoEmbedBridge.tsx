import { useEffect } from 'react'
import { sharedDemoMethod } from 'src/demo/interactiveDemo/content'

/** Let the embedded demo notify the parent wrapper on submission and page resize */
export function DemoEmbedBridge({ election_id, submitted }: { election_id: string; submitted: boolean }) {
  useEffect(() => {
    // Only for embedded demo elections
    if (!sharedDemoMethod(election_id) || window.parent === window) return

    // Set up post() helper
    const post = (message: Record<string, unknown>) =>
      window.parent.postMessage({ channel: 'siv-backend-demo', election_id, ...message }, window.location.origin)

    // Tell the parent window the embedded's resized height
    const main = document.querySelector('main')
    if (!main) return
    const resize = () => post({ height: Math.ceil(main.getBoundingClientRect().height) + 16, type: 'resize' })
    const observer = new ResizeObserver(resize)
    observer.observe(main)
    resize()

    // Tell the parent that a vote was submitted
    if (submitted) post({ type: 'submitted' })

    // Clean up
    return () => observer.disconnect()
  }, [election_id, submitted])
  return null
}
