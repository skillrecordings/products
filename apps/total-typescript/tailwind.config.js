/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

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
        heading: ['Magnat Head', ...defaultTheme.fontFamily.sans],
        text: ['Magnat Text', ...defaultTheme.fontFamily.sans],
        sans: ['Larsseit', ...defaultTheme.fontFamily.sans],
      },
      colors: {gray: colors.slate},
      screens: {
        '2xl': '1820px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '*': {
              color: theme('colors.white'),
            },
            'code::before': {
              content: "''",
            },
            'code::after': {
              content: "''",
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
    require('tailwindcss-radix'),
  ],
}
