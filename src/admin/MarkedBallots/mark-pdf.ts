import moment from 'moment'
import { PDFDocument, PDFFont, StandardFonts, rgb } from 'pdf-lib'
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

  let currentY = height - 98
  const col_width = 195

  // For each question:
  ;(JSON.parse(ballot_design) as Item[]).forEach(({ id = 'vote', options, title, write_in_allowed }) => {
    const questionYTop = currentY

    const x = 190

    const title_line_height = 12
    const title_x_padding = 5
    const title_y_padding = 6
    const num_lines = fillParagraph(title, helveticaFont, 10, col_width - title_x_padding * 2)

    const multi_line_offset = (num_lines - 1) * (title_line_height + 3)

    // Question title background rectangle
    const boxHeight = (title_line_height + 3) * num_lines
    page.drawRectangle({
      borderWidth: 0,
      color: rgb(0.85, 0.85, 0.85),
      height: boxHeight,
      width: col_width,
      x: x - title_x_padding,
      y: currentY - boxHeight + title_y_padding * 2 + multi_line_offset,
    })

    // Write question title
    page.drawText(title, {
      color: rgb(0, 0, 0),
      font: helveticaFont,
      lineHeight: title_line_height,
      maxWidth: col_width - title_x_padding * 2,
      size: 10,
      x: x,
      y: currentY + multi_line_offset,
    })

    const lineHeight = 22
    // Write each option
    options.forEach(({ name }) => {
      currentY -= lineHeight

      // Draw checkbox
      page.drawRectangle({
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
        color: vote[id] === name.toUpperCase() ? rgb(0.2, 0.2, 0.2) : undefined,
        height: 10,
        width: 16,
        x: x + 3,
        y: currentY,
      })

      // Write option name
      page.drawText(name, {
        color: rgb(0, 0, 0),
        font: helveticaFont,
        size: 12,
        x: x + 25,
        y: currentY,
      })
    })

    // Draw write-in
    if (write_in_allowed) {
      currentY -= lineHeight
      const did_write_in = vote[id] && !options.some(({ name }) => vote[id] === name.toUpperCase())

      // Draw checkbox
      page.drawRectangle({
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
        color: did_write_in ? rgb(0.2, 0.2, 0.2) : undefined,
        height: 10,
        width: 16,
        x: x + 3,
        y: currentY,
      })

      if (did_write_in) {
        // Write 'write-in'
        page.drawText(vote[id], {
          color: rgb(0, 0, 0),
          font: helveticaFont,
          size: 12,
          x: x + 25,
          y: currentY + 3,
        })
      }

      // Draw dotted line
      new Array(17).fill(true).forEach((_, dash) => {
        page.drawRectangle({
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
          height: 0,
          width: 5,
          x: x + 25 + dash * 8,
          y: currentY,
        })
      })

      currentY -= 9

      // Write 'write-in'
      page.drawText('Write-in', {
        color: rgb(0, 0, 0),
        font: helveticaFont,
        size: 8,
        x: x + 25,
        y: currentY,
      })
    }

    // Box bottom padding
    currentY -= 5

    const questionHeight = questionYTop - currentY + boxHeight - 3

    // Draw rectangle around whole question
    page.drawRectangle({
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
      height: questionHeight,
      width: col_width,
      x: x - title_x_padding,
      y: currentY,
    })

    // Question margin bottom
    currentY -= 30
  })

  return pdfDoc
}

// based on https://github.com/Hopding/pdf-lib/issues/20#issuecomment-894784448
const fillParagraph = (text: string, font: PDFFont, fontSize: number, maxWidth: number): number => {
  const paragraphs = text.split('\n')
  for (let index = 0; index < paragraphs.length; index++) {
    const paragraph = paragraphs[index]
    if (font.widthOfTextAtSize(paragraph, fontSize) > maxWidth) {
      const words = paragraph.split(' ')
      const newParagraph: string[][] = []
      let i = 0
      newParagraph[i] = []
      for (let k = 0; k < words.length; k++) {
        const word = words[k]
        newParagraph[i].push(word)
        if (font.widthOfTextAtSize(newParagraph[i].join(' '), fontSize) > maxWidth) {
          newParagraph[i].splice(-1)
          i = i + 1
          newParagraph[i] = []
          newParagraph[i].push(word)
        }
      }
      paragraphs[index] = newParagraph.map((p) => p.join(' ')).join('\n')
    }
  }
  return paragraphs.reduce((acc, p) => acc + p.split('\n').length, 0)
}
