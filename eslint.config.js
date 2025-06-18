const js = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const perfectionist = require('eslint-plugin-perfectionist')
const reactPlugin = require('eslint-plugin-react')
const globals = require('globals')
const { merge } = require('lodash')

// Common configuration shared between JS and TS files
const commonConfig = {
  files: ['**/*.js'],
  ignores: ['.next', 'node_modules', 'dist', 'build'],
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
  plugins: {
    react: reactPlugin,
  },
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    'no-unreachable': 'warn',
    'react/no-unknown-property': [2, { ignore: ['jsx', 'global'] }], // inserted by next's styled-jsx
  },
  settings: { react: { version: 'detect' } },
}

module.exports = [
  js.configs.recommended,
  perfectionist.configs['recommended-natural'],
  commonConfig,
  // TypeScript-specific overrides
  merge({}, commonConfig, {
    files: ['**/*.ts?(x)'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...tseslint.configs.strict.rules,
    },
  }),
]
