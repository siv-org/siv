const js = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const reactPlugin = require('eslint-plugin-react')
const globals = require('globals')
const perfectionist = require('eslint-plugin-perfectionist')

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
    'react/jsx-sort-props': ['error', { callbacksLast: true, shorthandFirst: true }],
    'react/no-unknown-property': [2, { ignore: ['jsx', 'global'] }], // inserted by next's styled-jsx
  },
  settings: { react: { version: 'detect' } },
}

module.exports = [
  js.configs.recommended,
  perfectionist.configs['recommended-natural'],
  commonConfig,
  // TypeScript-specific overrides
  {
    ...commonConfig,
    files: ['**/*.ts?(x)'],
    languageOptions: {
      ...commonConfig.languageOptions,
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      ...commonConfig.plugins,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...commonConfig.rules,
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
]
