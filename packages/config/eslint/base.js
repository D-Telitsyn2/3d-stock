module.exports = {
  root: true,
  extends: [
    '@next/eslint-config-next',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-const': 'error',
    'prefer-const': 'off',
    '@typescript-eslint/ban-ts-comment': 'error'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error']
      }
    }
  ],
  ignorePatterns: [
    'dist/',
    '.next/',
    'node_modules/',
    '*.js'
  ]
};
