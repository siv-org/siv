const js = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const reactPlugin = require('eslint-plugin-react')
const sortDestructureKeys = require('eslint-plugin-sort-destructure-keys')
const sortKeysFix = require('eslint-plugin-sort-keys-fix')
const typescriptSortKeys = require('eslint-plugin-typescript-sort-keys')
const globals = require('globals')

// Common configuration shared between JS and TS files
const commonConfig = {
  ignores: ['.next/**/*', 'node_modules/**/*', 'dist/**/*', 'build/**/*'],
  languageOptions: {
    ecmaVersion: 2022,
    globals: {
      ...globals.browser,
      ...globals.es2021,
      ...globals.node,
      JSX: 'readonly',
      React: 'readonly',
    },
    sourceType: 'module',
  },
  plugins: {
    react: reactPlugin,
    'sort-destructure-keys': sortDestructureKeys,
    'sort-keys-fix': sortKeysFix,
  },
  rules: {
    'react/jsx-sort-props': ['error', { callbacksLast: true, shorthandFirst: true }],
    'sort-destructure-keys/sort-destructure-keys': 'warn',
    'sort-keys-fix/sort-keys-fix': 'warn',
  },
  settings: { react: { version: 'detect' } },
}

module.exports = [
  js.configs.recommended,
  {
    // JavaScript-specific configuration
    files: ['**/*.js'],
    ...commonConfig,
  },
  {
    // TypeScript-specific configuration
    files: ['**/*.ts', '**/*.tsx'],
    ...commonConfig,
    languageOptions: {
      ...commonConfig.languageOptions,
      globals: { ...commonConfig.languageOptions.globals, NodeJS: 'readonly' },
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
      'typescript-sort-keys': typescriptSortKeys,
    },
    rules: {
      ...commonConfig.rules,
      ...tseslint.configs.base.rules,
      ...tseslint.configs.recommended.rules,
      ...typescriptSortKeys.configs.recommended.rules,
      // TypeScript-specific rule overrides
      '@typescript-eslint/ban-types': 'off', // Allow using object/Function types
      '@typescript-eslint/explicit-module-boundary-types': 'off', // verbose
      '@typescript-eslint/no-dynamic-delete': 'off', // Allow dynamic property deletion
      '@typescript-eslint/no-empty-function': 'off', // unnecessary
      '@typescript-eslint/no-invalid-void-type': 'off', // Allow void in promises
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow non-null assertions
      '@typescript-eslint/no-unused-expressions': 'off', // Allow short-circuit expressions
      '@typescript-eslint/no-unused-vars': 'warn', // hint not error
      'no-constant-binary-expression': 'off', // Allow constant binary expressions
      'no-redeclare': 'off', // Allow redeclaration in TypeScript
      'no-unreachable': 'warn', // Warn about unreachable code
    },
  },
]
