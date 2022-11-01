/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

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
    './node_modules/@skillrecordings/react/dist/**/*.js',
    './node_modules/@skillrecordings/convertkit/dist/**/*.js',
    './node_modules/@skillrecordings/quiz/dist/**/*.js',
    './node_modules/@skillrecordings/player/dist/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
        heading: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          red: '#F84072',
          gray: colors.slate,
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: rem(18),
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.heading').join(', '),
              fontWeight: theme('fontWeight.black'),
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
