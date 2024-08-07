module.exports = {
  create(context) {
    return {
      TSTypeReference(node) {
        if (
          node.typeName.name === 'Record' &&
          node.typeParameters.params.length === 2 &&
          node.typeParameters.params[0].type === 'TSStringKeyword'
        ) {
          // Check if the parent node is a TSTypeReference or TSTypeOperator
          // This handles cases like Partial<Record<string, T>>
          let parent = node.parent
          while (parent) {
            if (parent.type === 'TSTypeReference' || parent.type === 'TSTypeOperator') {
              // If the parent type is TSTypeReference or TSTypeOperator, it means
              // Record<string, T> is nested inside another type, so skip reporting
              return
            }
            parent = parent.parent
          }

          context.report({
            message: 'Direct use of Record<string, T> is unsafe. Use Partial<Record<string, T>> or explicit indices.',
            node,
          })
        }
      },
    }
  },
}
