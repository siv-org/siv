import { useEffect } from 'react'
import { sharedDemoMethod } from 'src/demo/interactiveDemo/content'

/** Let the embedded demo notify the parent wrapper on submission */
export function DemoEmbedBridge({ election_id, submitted }: { election_id: string; submitted: boolean }) {
  useEffect(() => {
    // Only for embedded demo elections
    if (!sharedDemoMethod(election_id) || window.parent === window) return

    // Tell the parent that a vote was submitted so the demo can advance to verification.
    if (submitted)
      window.parent.postMessage({ channel: 'siv-backend-demo', election_id, type: 'submitted' }, window.location.origin)
  }, [election_id, submitted])
  return null
}
