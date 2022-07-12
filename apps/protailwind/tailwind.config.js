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
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
