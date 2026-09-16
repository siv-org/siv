/** @returns {import('eslint').ESLint.Plugin} */
function sivPlugin() {
  return {
    rules: {
      'no-req-headers-host': require('./no-req-headers-host'),
      'prefer-compact-if-return': require('./prefer-compact-if-return'),
      'return-res-response': require('./return-res-response'),
    },
  }
}

module.exports = { sivPlugin }
