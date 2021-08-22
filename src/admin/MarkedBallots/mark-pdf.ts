import moment from 'moment'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Item } from 'src/vote/storeElectionInfo'

export const markPdf = async ({
  ballot_design,
  election_title,
  vote,
}: {
  ballot_design: string
  election_title: string
  vote: Record<string, string>
}) => {
  // Fetch an existing PDF document
  const existingPdfBytes = await fetch(`${window.location.origin}/sample-ballot.pdf`).then((res) => res.arrayBuffer())

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Get the first page of the document
  const pages = pdfDoc.getPages()
  const page = pages[0]

  // Get the width and height of the first page
  const { height, width } = page.getSize()

  // Write in election title
  const size = 16
  page.drawText(election_title, {
    color: rgb(0, 0, 0),
    font: helveticaFont,
    size,
    x: (width - helveticaFont.widthOfTextAtSize(election_title, size)) / 2,
    y: height - 30,
  })

  // Write in Verification #
  const trackingSize = 10
  page.drawText(vote.tracking, {
    color: rgb(0.3, 0.3, 0.3),
    font: helveticaFont,
    size: trackingSize,
    x: width - helveticaFont.widthOfTextAtSize(vote.tracking, trackingSize) - 10,
    y: height - 15,
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
  ;(JSON.parse(ballot_design) as Item[]).forEach(({ id = 'vote', options, title, write_in_allowed }, index) => {
    const questionY = height - 100 - 140 * index

    const x = 190

    // Draw rectangle for question title
    page.drawRectangle({
      borderWidth: 0,
      color: rgb(0.85, 0.85, 0.85),
      height: 20,
      width: 192,
      x: x - 5,
      y: questionY - 5,
    })

    // Draw rectangle around question
    page.drawRectangle({
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
      height: 130,
      width: 192,
      x: x - 5,
      y: questionY - 114,
    })

    // Write question title
    page.drawText(title, {
      color: rgb(0, 0, 0),
      font: helveticaFont,
      size: 10,
      x: x,
      y: questionY,
    })

    // Write each option
    options.forEach(({ name }, index) => {
      const y = questionY - (20 + index * lineHeight)

      // Draw checkbox
      page.drawRectangle({
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
        color: vote[id] === name.toUpperCase() ? rgb(0.2, 0.2, 0.2) : undefined,
        height: 10,
        width: 16,
        x: x + 3,
        y,
      })

      // Write option name
      page.drawText(name, {
        color: rgb(0, 0, 0),
        font: helveticaFont,
        size: 12,
        x: x + 25,
        y,
      })
    })

    const writeInY = questionY - (20 + options.length * lineHeight)

    // Draw write-in
    if (write_in_allowed) {
      const did_write_in = vote[id] && !options.some(({ name }) => vote[id] === name.toUpperCase())

      // Draw checkbox
      page.drawRectangle({
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
        color: did_write_in ? rgb(0.2, 0.2, 0.2) : undefined,
        height: 10,
        width: 16,
        x: x + 3,
        y: writeInY,
      })

      if (did_write_in) {
        // Write 'write-in'
        page.drawText(vote[id], {
          color: rgb(0, 0, 0),
          font: helveticaFont,
          size: 12,
          x: x + 25,
          y: writeInY + 3,
        })
      }

      // Draw dotted line
      new Array(17).fill(true).forEach((_, index) => {
        page.drawRectangle({
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
          height: 0,
          width: 5,
          x: x + 25 + index * 8,
          y: writeInY,
        })
      })

      // Write 'write-in'
      page.drawText('Write-in', {
        color: rgb(0, 0, 0),
        font: helveticaFont,
        size: 8,
        x: x + 25,
        y: writeInY - 9,
      })
    }
  })

  return pdfDoc
}
