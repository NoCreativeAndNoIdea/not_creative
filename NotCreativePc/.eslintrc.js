module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'vue/valid-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
  },
}
