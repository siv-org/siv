module.exports = {
  env: {
    'cypress/globals': true,
  },
  extends: ['plugin:cypress/recommended'],
  plugins: ['cypress'],
  rules: {
    'cypress/unsafe-to-chain-command': 0,
  },
}
