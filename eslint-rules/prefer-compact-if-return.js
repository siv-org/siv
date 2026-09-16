/**
 * Prefer `if (cond) return x` over `if (cond) { return x }` when the one-liner fits printWidth.
 *
 * Skips `if/else` — the autofix replaces the whole statement and would drop the else branch.
 *
 * Bad (when it fits on one line):
 *   if (!data) {
 *     return res.status(404).json({ opens: {} })
 *   }
 *
 * Good:
 *   if (!data) return res.status(404).json({ opens: {} })
 */
const PRINT_WIDTH = 120

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    const sourceCode = context.sourceCode

    return {
      IfStatement(node) {
        // Don't touch if/else — replacing the whole node would drop the else branch
        if (node.alternate) return

        const { consequent } = node
        if (consequent.type !== 'BlockStatement') return
        if (consequent.body.length !== 1) return
        if (sourceCode.getCommentsInside(consequent).length) return

        const stmt = consequent.body[0]
        if (stmt.type !== 'ReturnStatement' && stmt.type !== 'ExpressionStatement') return

        const compact = `if (${sourceCode.getText(node.test)}) ${sourceCode.getText(stmt)}`
        if (compact.length > PRINT_WIDTH) return

        context.report({
          fix: (fixer) => fixer.replaceText(node, compact),
          message: `Prefer a one-line if (${compact.length} chars ≤ ${PRINT_WIDTH}).`,
          node,
        })
      },
    }
  },
  meta: {
    docs: { description: 'Prefer compact one-line if/return when it fits printWidth' },
    fixable: 'code',
    schema: [],
    type: 'layout',
  },
}
