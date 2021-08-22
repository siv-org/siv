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
      const page = pages[0]

      // Get the width and height of the first page
      const { height, width } = page.getSize()

      // Write in title
      const size = 16
      page.drawText(title, {
        color: rgb(0, 0, 0),
        font: helveticaFont,
        size,
        x: (width - helveticaFont.widthOfTextAtSize(title, size)) / 2,
        y: height - 30,
      })

      // Write in date
      page.drawText(`Printed: ${moment().format('MMM D, YYYY')}`, {
        color: rgb(0, 0, 0),
        font: helveticaFont,
        size: 13,
        x: 10,
        y: height - 70,
      })

      const lineHeight = 22

      // For each question:
      JSON.parse(ballot_design).forEach(({ options, title, write_in_allowed }: Item) => {
        // Write title
        page.drawText(title, {
          color: rgb(0, 0, 0),
          font: helveticaFont,
          size: 13,
          x: 200,
          y: height - 100,
        })

        // Write each option
        options.forEach(({ name }, index) => {
          const y = height - (120 + index * lineHeight)

          // Draw checkbox
          page.drawRectangle({
            borderColor: rgb(0, 0, 0),
            borderWidth: 2,
            height: 10,
            width: 16,
            x: 203,
            y,
          })

          // Write option name
          page.drawText(name, {
            color: rgb(0, 0, 0),
            font: helveticaFont,
            size: 12,
            x: 225,
            y,
          })
        })

        const writeInY = height - (120 + options.length * lineHeight)

        // Draw write-in
        if (write_in_allowed) {
          // Draw checkbox
          page.drawRectangle({
            borderColor: rgb(0, 0, 0),
            borderWidth: 2,
            height: 10,
            width: 16,
            x: 203,
            y: writeInY,
          })

          // Draw dotted line
          new Array(17).fill(true).forEach((_, index) => {
            page.drawRectangle({
              borderColor: rgb(0, 0, 0),
              borderWidth: 1,
              height: 0,
              width: 5,
              x: 225 + index * 8,
              y: writeInY,
            })
          })

          // Write 'write-in'
          page.drawText('Write-in', {
            color: rgb(0, 0, 0),
            font: helveticaFont,
            size: 8,
            x: 225,
            y: writeInY - 9,
          })
        }
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
