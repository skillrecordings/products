/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

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
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        sicret: ['Sicret Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: colors.orange[400],
        gray: {
          0: '#ffffff',
          100: '#dadadb',
          200: '#b7b7b8',
          300: '#979697',
          400: '#787879',
          500: '#5d5c5d',
          600: '#444445',
          700: '#212021',
          800: '#101011',
          900: '#060507',
        },
      },
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
  plugins: [require('@tailwindcss/typography')],
}
