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
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['TT Commons W01 Regular', ...defaultTheme.fontFamily.sans],
        'tt-light': 'TT Commons W01 Light',
        'tt-regular': 'TT Commons W01 Regular',
        'tt-medium': 'TT Commons W01 Medium',
        'tt-demibold': 'TT Commons W01 DemiBold',
      },
      colors: {
        body: '#1b1b1f',
        checkmark: '#5cc7c7',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {},
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
