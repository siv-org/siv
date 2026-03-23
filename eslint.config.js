const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const perfectionist = require('eslint-plugin-perfectionist')
const reactPlugin = require('eslint-plugin-react')
const globals = require('globals')
const { merge } = require('lodash')

// Common configuration shared between JS and TS files
const commonConfig = {
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 2018,
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
  plugins: { react: reactPlugin },
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    'no-unreachable': 'warn',
    'react/no-unknown-property': [2, { ignore: ['jsx', 'global'] }], // styled-jsx
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
    rules: { ...tseslint.plugin.configs.strict.rules },
  }),
]
