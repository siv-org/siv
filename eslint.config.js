const js = require('@eslint/js')
const perfectionist = require('eslint-plugin-perfectionist')
const reactPlugin = require('eslint-plugin-react')
const globals = require('globals')
const { merge } = require('lodash')
const tseslint = require('typescript-eslint')

const { sivPlugin } = require('./eslint-rules')

// Common configuration shared between JS and TS files
const commonConfig = {
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 2022,
    globals: {
      ...globals.browser,
      ...globals.es2021,
      ...globals.node,
      JSX: 'readonly',
      NodeJS: 'readonly',
      React: 'readonly',
    },
    sourceType: 'module',
  },
  plugins: { react: reactPlugin, siv: sivPlugin() },
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    'no-unreachable': 'warn',
    'react/no-unknown-property': [2, { ignore: ['jsx', 'global'] }], // styled-jsx
    'siv/no-req-headers-host': 'warn',
    'siv/secrets-match': 'error',
  },
  settings: { react: { version: 'detect' } },
}

module.exports = [
  { ignores: ['.next', 'node_modules', 'dist', 'build'] },
  js.configs.recommended,
  perfectionist.configs['recommended-natural'],
  commonConfig,

  // TypeScript-specific overrides
  merge({}, commonConfig, {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tseslint.parser, parserOptions: { projectService: true } },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      ...tseslint.plugin.configs.strict.rules,
      // 'siv/prefer-compact-if-return': 'error', // TODO: re-enable
    },
  }),

  // Next.js API routes — default-exported (req, res) handlers only
  // { files: ['pages/api/**/*.ts'], rules: { 'siv/return-res-response': 'error' } }, // TODO: re-enable
]
