/*
Don't trust spoofable `req.headers.host` / `req.headers.origin`.

Clients can set these to arbitrary values. Use `safeOrigin(req)` for the real request origin.

Bad:
  if (req.headers.origin !== 'https://siv.org') return forbid()

Good:
  if (safeOrigin(req) !== 'https://siv.org') return forbid()
*/

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      MemberExpression(node) {
        const prop =
          !node.computed && node.property.type === 'Identifier'
            ? node.property.name
            : node.computed && node.property.type === 'Literal'
            ? node.property.value
            : undefined
        if (typeof prop !== 'string' || !['host', 'origin'].includes(prop)) return

        const obj = node.object.type === 'ChainExpression' ? node.object.expression : node.object
        const fromReqHeaders =
          obj.type === 'MemberExpression' && obj.property.type === 'Identifier' && obj.property.name === 'headers'
        const fromHeadersVar = obj.type === 'Identifier' && obj.name === 'headers'
        if (!fromReqHeaders && !fromHeadersVar) return

        context.report({
          message: "Don't trust spoofable req.headers.host/origin. Prefer safeOrigin(req)",
          node,
        })
      },
    }
  },
  meta: { docs: {}, schema: [], type: 'problem' },
}
