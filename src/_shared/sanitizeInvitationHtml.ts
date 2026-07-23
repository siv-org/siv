import sanitizeHtml from 'sanitize-html'

/** Allow only the tags CustomInvitationEditor markdown can produce. */
export function sanitizeInvitationHtml(html: string) {
  return sanitizeHtml(html, {
    allowedAttributes: { a: ['href'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedTags: ['a', 'br', 'em', 'h2', 'li', 'ol', 'p', 'strong', 'ul'],
  })
}
