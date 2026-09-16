/*
Require `return` on `res.status(...).json|send|text|end(...)` inside Next.js API handlers.

On Vercel, the function freezes after a response is sent — later code never runs.
Locally it keeps going, so missing `return`s can cause hard-to-find unreachable-code bugs in prod, that worked fine in localdev.

Scoped to default-exported handlers with signature
`(req: NextApiRequest, res: NextApiResponse)` — helpers like `_admin-file-upload.ts` and
`_cors.ts`'s `allowCors` wrapper is skipped; only the default-exported handler is checked.

Bad:
  if (!election_id) res.status(400).json({ error: 'Missing election_id' })
  // ...more logic that runs locally, but not in prod

Good:
  if (!election_id) return res.status(400).json({ error: 'Missing election_id' })
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
            : 'Vercel kills endpoints after a response, localdev does not. Return it to avoid hard-to-find unreached-code bugs.',
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
