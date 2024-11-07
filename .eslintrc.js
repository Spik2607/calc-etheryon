module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off'
  }
};
