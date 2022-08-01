/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`

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
        sans: ['degular', ...defaultTheme.fontFamily.sans],
        heading: ['degular-display', ...defaultTheme.fontFamily.sans],
        display: [
          'bebas-neue-pro-semiexpanded',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: rem(18),
            '*': {
              color: theme('colors.slate.200'),
              fontWeight: theme('fontWeight.light'),
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
          },
        },
        lg: {
          css: {
            fontSize: rem(20),
          },
        },
        xl: {
          css: {
            fontSize: rem(22),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
