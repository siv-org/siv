module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:typescript-sort-keys/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'typescript-sort-keys',
    'sort-destructure-keys',
    'sort-keys-fix',
    'no-direct-record-string',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0, // Verbose
    '@typescript-eslint/no-empty-function': 0, // unnecessary
    '@typescript-eslint/no-unused-vars': 1, // hint not error
    'no-direct-record-string/no-direct-record-string': 'error', // type safety
    'react/jsx-sort-props': [2, { callbacksLast: true, shorthandFirst: true }], // style
    'react/no-unknown-property': [2, { ignore: ['jsx', 'global'] }], // inserted by next's styled-jsx
    'react/react-in-jsx-scope': 0, // Handled by Next.js
    'sort-destructure-keys/sort-destructure-keys': 1, // style
    'sort-keys-fix/sort-keys-fix': 1, // style
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
