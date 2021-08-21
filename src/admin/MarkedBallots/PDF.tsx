import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { useEffect } from 'react'

export const PDF = () => {
  const sample_url = `${window.location.origin}/sample-ballot.pdf`

  useEffect(() => {
    modifyPdf({ base: sample_url })
  }, [])

  return <iframe id="iframe" style={{ height: 500, maxWidth: 500, width: '100%' }} />
}

async function modifyPdf({ base }: { base: string }) {
  // Fetch an existing PDF document
  const existingPdfBytes = await fetch(base).then((res) => res.arrayBuffer())

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Get the first page of the document
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  // Get the width and height of the first page
  const { height, width } = firstPage.getSize()

  // Draw a string of text diagonally across the first page
  const title = 'Election Title'
  const size = 16
  firstPage.drawText(title, {
    color: rgb(0, 0, 0),
    font: helveticaFont,
    size,
    x: (width - helveticaFont.widthOfTextAtSize(title, size)) / 2,
    y: height - 30,
  })

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const blobUrl = URL.createObjectURL(blob)
  const el = document.getElementById('iframe') as HTMLIFrameElement
  if (!el) return alert("Can't find iframe to insert pdf")
  el.src = blobUrl
}
