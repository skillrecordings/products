/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['prettier', 'next/core-web-vitals'],
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-assign-module-variable': 'off',
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
}
