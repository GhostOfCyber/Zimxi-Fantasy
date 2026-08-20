module.exports = {
  env: {
    browser: true,  // For React
    commonjs: true, // For Node
    es2021: true,
    node: true,     // For Node
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off', // Allow console logs for this MVP
    'no-undef': 'warn'
  },
  ignorePatterns: ['dist', 'node_modules']
};