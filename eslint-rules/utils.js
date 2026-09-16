const RESPONSE_METHODS = new Set(['end', 'json', 'send', 'text'])
const HANDLER_FN_TYPES = new Set(['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression'])

function getEnclosingFunction(node) {
  let current = node.parent
  while (current) {
    if (HANDLER_FN_TYPES.has(current.type)) return current
    current = current.parent
  }
  return null
}

/** Default-exported Next.js API route: `(req: NextApiRequest, res: NextApiResponse) => …` */
function isNextApiRouteHandler(fn, /** @type {import('eslint').SourceCode} */ sourceCode) {
  if (!fn || !HANDLER_FN_TYPES.has(fn.type)) return false
  const [reqParam, resParam] = fn.params
  if (reqParam?.type !== 'Identifier' || reqParam.name !== 'req') return false
  if (resParam?.type !== 'Identifier' || resParam.name !== 'res') return false

  const reqType = reqParam.typeAnnotation?.typeAnnotation
  const resType = resParam.typeAnnotation?.typeAnnotation
  if (reqType && resType) {
    return (
      sourceCode.getText(reqType).includes('NextApiRequest') && sourceCode.getText(resType).includes('NextApiResponse')
    )
  }

  // ponytail: pages/api/** always names them req/res even when annotations are omitted
  return true
}

/** `res.status(400).json(...)`, `res.json(...)`, etc. */
function isResResponseCall(node) {
  if (node?.type !== 'CallExpression') return false
  const method = node.callee?.property?.name
  if (!RESPONSE_METHODS.has(method)) return false
  const obj = node.callee.object
  // res.status(200).json(...) — .status(...) is a CallExpression, not a MemberExpression
  if (obj?.type === 'CallExpression') {
    const status = obj.callee
    if (status?.type === 'MemberExpression' && status.property?.name === 'status' && status.object?.name === 'res')
      return true
  }
  if (obj?.type === 'MemberExpression' && obj.property?.name === 'status' && obj.object?.name === 'res') return true
  if (obj?.type === 'Identifier' && obj.name === 'res') return true
  return false
}

/** Unwrap `export default fn` / `export default wrap(fn)` to the inner handler function. */
function unwrapDefaultExportHandler(declaration) {
  if (!declaration) return null
  if (HANDLER_FN_TYPES.has(declaration.type)) return declaration
  if (declaration.type === 'CallExpression') {
    const inner = declaration.arguments.find((arg) => HANDLER_FN_TYPES.has(arg?.type))
    return inner ?? null
  }
  return null
}

module.exports = {
  getEnclosingFunction,
  isNextApiRouteHandler,
  isResResponseCall,
  unwrapDefaultExportHandler,
}
