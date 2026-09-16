/**
 * Ban direct `===` / `!==` on secret fields — `undefined === undefined` is true,
 * so missing values can incorrectly match. Use `secretsMatch(stored, provided)`.
 *
 * Bad:
 *   if (voter.auth_token === auth) return res.status(200).json({ ok: true })
 *   if (auth_token !== provided) return res.status(401).json({ error: 'Unauthorized' })
 *
 * Good:
 *   if (secretsMatch(voter.auth_token, auth)) return res.status(200).json({ ok: true })
 *   if (!secretsMatch(auth_token, provided)) return res.status(401).json({ error: 'Unauthorized' })
 *
 * `auth` is only flagged when compared to a variable (not a string literal like `'link'`).
 */

const SECRET_FIELDS = new Set(['auth_token', 'init_login_code', 'link_auth', 'login_code', 'verification_code'])

/** `auth` member access — only ban when the other side isn't a string literal. */
function isAuthMember(node) {
  if (node?.type === 'MemberExpression' && !node.computed && node.property?.type === 'Identifier')
    return node.property.name === 'auth'
  if (node?.type === 'ChainExpression') return isAuthMember(node.expression)
  return false
}

/** Property name of `obj.auth_token` / `obj?.auth_token`, or identifier name. */
function secretName(node) {
  if (node?.type === 'Identifier' && SECRET_FIELDS.has(node.name)) return node.name
  if (node?.type === 'MemberExpression' && !node.computed && node.property?.type === 'Identifier') {
    if (SECRET_FIELDS.has(node.property.name)) return node.property.name
  }
  if (node?.type === 'ChainExpression') return secretName(node.expression)
  return null
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      BinaryExpression(node) {
        if (node.operator !== '===' && node.operator !== '!==') return

        if (secretName(node.left) || secretName(node.right)) {
          context.report({
            message: "Don't directly compare secret fields with === or !==. Use secretsMatch()",
            node,
          })
          return
        }

        // auth vs variable only — `auth === 'link'` is fine
        const authOnLeft = isAuthMember(node.left) && node.right.type !== 'Literal'
        const authOnRight = isAuthMember(node.right) && node.left.type !== 'Literal'
        if (authOnLeft || authOnRight) {
          context.report({
            message: "Don't directly compare secret fields with === or !==. Use secretsMatch()",
            node,
          })
        }
      },
    }
  },
  meta: {
    docs: { description: 'Require secretsMatch() instead of ===/!== on secret fields' },
    schema: [],
    type: 'problem',
  },
}
