import moment from 'moment'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { useEffect } from 'react'
import { Item } from 'src/vote/storeElectionInfo'

import { useStored } from '../useStored'

export const PDF = () => {
  const sample_url = `${window.location.origin}/sample-ballot.pdf`
  const { ballot_design = '[]', election_title: title = '' } = useStored()

  useEffect(() => {
    async function modifyPdf() {
      // Fetch an existing PDF document
      const existingPdfBytes = await fetch(sample_url).then((res) => res.arrayBuffer())

      // Load a PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes)

      // Embed the Helvetica font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

      // Get the first page of the document
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]

      // Get the width and height of the first page
      const { height, width } = firstPage.getSize()

      // Write in title
      const size = 16
      firstPage.drawText(title, {
        color: rgb(0, 0, 0),
        font: helveticaFont,
        size,
        x: (width - helveticaFont.widthOfTextAtSize(title, size)) / 2,
        y: height - 30,
      })

      // Write in date
      firstPage.drawText(`Printed: ${moment().format('MMM D, YYYY')}`, {
        color: rgb(0, 0, 0),
        font: helveticaFont,
        size: 13,
        x: 10,
        y: height - 70,
      })

      // For each question:
      JSON.parse(ballot_design).forEach(({ options, title }: Item) => {
        // Write title
        firstPage.drawText(title, {
          color: rgb(0, 0, 0),
          font: helveticaFont,
          size: 13,
          x: 200,
          y: height - 100,
        })

        // Write each option
        options.forEach(({ name }, index) => {
          firstPage.drawText(name, {
            color: rgb(0, 0, 0),
            font: helveticaFont,
            size: 12,
            x: 225,
            y: height - (120 + index * 17),
          })
        })
      })

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      const el = document.getElementById('iframe') as HTMLIFrameElement
      if (!el) return alert("Can't find iframe to insert pdf")
      el.src = blobUrl
    }
    modifyPdf()
  }, [])

  return <iframe id="iframe" style={{ borderWidth: 1, height: 500, maxWidth: 500, width: '100%' }} />
}
