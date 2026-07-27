import { escapeHtml } from './escapeHtml'

const ALLOWED = new Set(['a', 'br', 'em', 'h2', 'li', 'ol', 'p', 'strong', 'ul'])

/**
 * Allow only tags CustomInvitationEditor markdown can produce.
 * ponytail: regex allowlist, not a full HTML parser — enough for marked email copy.
 * Ceiling: adversarial malformed markup. Upgrade: CJS-safe sanitizer or NODE_OPTIONS require(ESM).
 */
export function sanitizeInvitationHtml(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-zA-Z][\w:-]*)\b([^>]*)>/g, (tag, rawName: string, attrs: string) => {
      const name = rawName.toLowerCase()
      if (!ALLOWED.has(name)) return ''
      if (tag.startsWith('</')) return `</${name}>`
      if (name === 'br') return '<br>'
      if (name === 'a') {
        const href = safeHref(attrs)
        return href ? `<a href="${escapeHtml(href)}">` : '<a>'
      }
      return `<${name}>`
    })
}

function safeHref(attrs: string) {
  const match = attrs.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
  if (!match) return null
  const href = (match[1] ?? match[2] ?? match[3] ?? '').trim()
  return /^(https?:|mailto:)/i.test(href) ? href : null
}
