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
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 0, // Handled by Next.js
    '@typescript-eslint/explicit-module-boundary-types': 0, // Verbose
    'sort-destructure-keys/sort-destructure-keys': 2, // style
    'sort-keys-fix/sort-keys-fix': 2, // style
    'react/jsx-sort-props': 2, // style
  },
}
