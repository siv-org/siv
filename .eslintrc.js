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
  plugins: ['react', '@typescript-eslint', 'typescript-sort-keys', 'sort-destructure-keys', 'sort-keys-fix'],
  rules: {
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
