/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.tsx',
    './src/**/*.mdx',
    './node_modules/@skillrecordings/commerce/dist/**/*.js',
    './node_modules/@skillrecordings/react/dist/**/*.js',
    './node_modules/@skillrecordings/convertkit/dist/**/*.js',
    './node_modules/@skillrecordings/quiz/dist/**/*.js',
    './node_modules/@skillrecordings/player/dist/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Magnat Head', ...defaultTheme.fontFamily.sans],
        sans: ['Magnat Text', ...defaultTheme.fontFamily.sans],
        text: ['Magnat Text', ...defaultTheme.fontFamily.sans],
      },
      colors: {},
      typography: (theme) => ({
        DEFAULT: {
          css: {},
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
