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
            color: theme('colors.white'),
            code: {color: theme('colors.white')},
            'h1, h2, h3, h4': {
              color: theme('colors.gray.100'),
            },
            li: {
              color: theme('colors.gray.300'),
            },
            a: {
              color: theme('colors.cyan.300'),
            },
            'a:hover': {
              color: theme('colors.cyan.200'),
            },
            p: {
              color: theme('colors.gray.300'),
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
