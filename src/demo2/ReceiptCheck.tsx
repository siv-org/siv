import { useEffect, useRef, useState } from 'react'
import { Head } from 'src/Head'

import { checkReceipt } from './election'

export function ReceiptCheck() {
  const [lines, setLines] = useState<string[]>([])
  const [error, setError] = useState('')
  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    try {
      if (!window.location.hash || window.location.hash.length > 16000)
        throw new Error('Missing or invalid private receipt. Create a new check link from the demo.')
      const receipt = JSON.parse(decodeURIComponent(window.location.hash.slice(1)))
      window.history.replaceState(null, '', window.location.pathname)
      setLines(checkReceipt(receipt))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not check this receipt.')
    }
  }, [])
  return (
    <main style={{ fontFamily: 'system-ui', margin: '60px auto', maxWidth: 650, padding: 24 }}>
      <Head title="SIV · Independent receipt check" />
      <p style={{ color: '#215c42' }}>SIV / DEMO ELECTION</p>
      <h1>What was actually encrypted?</h1>
      <p>
        This page independently decrypts the receipt using SIV’s cryptographic code. Compare the Verification # and
        selections below with what you intended.
      </p>
      {lines.length > 0 && (
        <>
          <p>Format: ballot column: Verification #: selection</p>
          <pre style={{ background: '#eff5ef', overflowWrap: 'anywhere', padding: 20, whiteSpace: 'pre-wrap' }}>
            {lines.join('\n')}
          </pre>
          <p>
            This checks the supplied receipt. In this browser-only demo, it does not independently contact a public
            election server or prove that the receipt was accepted there.
          </p>
          <button
            onClick={() => {
              setLines([])
              setError('Private receipt cleared. Close this tab when finished.')
            }}
            type="button"
          >
            Clear private receipt
          </button>
        </>
      )}
      {error && <p role="status">{error}</p>}
      <p>
        <a href="/demo-2">Back to the demo</a>
      </p>
    </main>
  )
}
