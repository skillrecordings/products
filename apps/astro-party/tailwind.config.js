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
        heading: ['var(--font-cooper)', ...defaultTheme.fontFamily.sans],
        fun: ['var(--font-cooper-goodtime)', ...defaultTheme.fontFamily.sans],
        rounded: ['var(--font-fredoka)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          primary: '#00924E',
          'primary-light': '#00A156',
          yellow: '#FFE242',
          blue: '#AFEFFF',
          red: '#EB5228',
        },
      },
      screens: {
        '2xl': '1820px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {},
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
