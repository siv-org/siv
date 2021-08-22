import { useEffect } from 'react'

import { useStored } from '../useStored'
import { markPdf } from './mark-pdf'

export const EmbeddedPdf = ({ index, vote }: { index: number; vote: Record<string, string> }) => {
  const { ballot_design, election_title } = useStored()

  useEffect(() => {
    async function renderToIframe() {
      if (!ballot_design || !election_title) return

      const pdfBytes = await (await markPdf({ ballot_design, election_title, vote })).save()

      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      const el = document.getElementById(`iframe-${index}`) as HTMLIFrameElement
      if (!el) return alert("Can't find iframe to insert pdf")
      el.src = blobUrl
    }
    renderToIframe()
  }, [election_title, ballot_design, vote])

  return <iframe id={`iframe-${index}`} style={{ borderWidth: 1, height: 500, maxWidth: 500, width: '100%' }} />
}
