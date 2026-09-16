/**
 * Require `return` on `res.status(...).json|send|text|end(...)` inside Next.js API handlers.
 *
 * Scoped to default-exported handlers with signature
 * `(req: NextApiRequest, res: NextApiResponse)` — helpers like `_admin-file-upload.ts` and
 * `_cors.ts`'s `allowCors` wrapper is skipped; only the default-exported handler is checked.
 *
 * Bad:
 *   if (!election_id) {
 *     res.status(400).json({ error: 'Missing election_id' })
 *     return
 *   }
 *   res.status(200).json({ ok: true })
 *
 * Good:
 *   if (!election_id) return res.status(400).json({ error: 'Missing election_id' })
 *   return res.status(200).json({ ok: true })
 */
const {
  getEnclosingFunction,
  isNextApiRouteHandler,
  isResResponseCall,
  unwrapDefaultExportHandler,
} = require('./utils')

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    const sourceCode = context.sourceCode
    /** @type {Set<object>} */
    const apiHandlers = new Set()

    return {
      ExportDefaultDeclaration(node) {
        const handler = unwrapDefaultExportHandler(node.declaration)
        if (handler && isNextApiRouteHandler(handler, sourceCode)) apiHandlers.add(handler)
      },

      ExpressionStatement(node) {
        if (!isResResponseCall(node.expression)) return
        const fn = getEnclosingFunction(node)
        if (!fn || !apiHandlers.has(fn)) return

        const parent = node.parent
        const siblings = parent?.type === 'BlockStatement' ? parent.body : null
        const nextIdx = siblings ? siblings.indexOf(node) : -1
        const nextStmt = nextIdx >= 0 && siblings ? siblings[nextIdx + 1] : null
        const bareReturnAfter = nextStmt?.type === 'ReturnStatement' && nextStmt.argument === null

        context.report({
          fix(fixer) {
            const exprText = sourceCode.getText(node.expression)
            const fixes = [fixer.replaceText(node, `return ${exprText}`)]
            if (bareReturnAfter && nextStmt) fixes.push(fixer.remove(nextStmt))
            return fixes
          },
          message: bareReturnAfter
            ? 'Return the response call directly instead of a separate bare return.'
            : 'Return the response call so the handler stops and callers see the response.',
          node,
        })
      },
    }
  },
  meta: {
    docs: { description: 'Require return on res.status().json/send/text/end() in API route handlers' },
    fixable: 'code',
    schema: [],
    type: 'problem',
  },
}
