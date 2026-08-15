const js = require('@eslint/js')
const perfectionist = require('eslint-plugin-perfectionist')
const reactPlugin = require('eslint-plugin-react')
const globals = require('globals')
const { merge } = require('lodash')
const tseslint = require('typescript-eslint')

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
  plugins: { react: reactPlugin, siv: sivPlugin() },
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    'no-restricted-syntax': ['error', ...secretsMatchSelectors()],
    'no-unreachable': 'warn',
    'react/no-unknown-property': [2, { ignore: ['jsx', 'global'] }], // styled-jsx
    'siv/no-req-headers-host': 'warn',
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

function secretsMatchSelectors() {
  // Ban `stored === provided` on secrets, because `undefined === undefined`,
  // so we need extra checks. `secretsMatch(stored, provided)` is safer.

  const eq = 'BinaryExpression[operator=/^[!=]==$/]'
  const fields = 'auth_token|login_code|init_login_code|verification_code|link_auth'
  const field = `[property.name=/^(${fields})$/]`
  return [
    `${eq} > MemberExpression${field}`,
    `${eq} > Identifier[name=/^(${fields})$/]`,
    `${eq} ChainExpression > MemberExpression${field}`,

    // Only error when auth is compared against a variable, not a string literal
    `${eq}[right.type!='Literal'] > MemberExpression.left[property.name='auth']`,
    `${eq}[left.type!='Literal'] > MemberExpression.right[property.name='auth']`,
  ].map((selector) => ({ message: "Don't directly compare secret fields with ===/!==. Use secretsMatch()", selector }))
}

function sivPlugin() {
  return {
    rules: {
      'no-req-headers-host': {
        create(context) {
          return {
            MemberExpression(node) {
              const prop = node.computed ? node.property.value : node.property.name
              if (prop !== 'host') return
              const obj = node.object.type === 'ChainExpression' ? node.object.expression : node.object
              if (obj.type !== 'MemberExpression' || obj.property.name !== 'headers') return
              context.report({
                message: "Don't trust req.headers.host, can be spoofed. Prefer safeOrigin(req)",
                node,
              })
            },
          }
        },
        meta: { docs: {}, schema: [], type: 'problem' },
      },
    },
  }
}
