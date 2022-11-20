/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

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
        sans: [...defaultTheme.fontFamily.sans],
        heading: [...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: '#5d47f7',
        gray: {
          50: '#FFF',
          100: '#f8f8f8',
          200: '#dadadd',
          300: '#aaaab0',
          400: '#4f515d',
          500: '#3f414e',
          600: '#2f313f',
          700: '#1f2130',
          800: '#141626',
          900: '#060819',
          1000: '#040511',
        },
      },
      screens: {
        '2xl': '1820px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: rem(18),
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.heading').join(', '),
              fontWeight: theme('fontWeight.medium'),
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
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
    plugin(({addVariant}) => {
      addVariant('supports-backdrop-blur', '@supports (backdrop-filter: none)')
      addVariant('firefox', '@supports (-moz-appearance: none)')
      addVariant('safari', '@supports selector(:nth-child(1 of x))')
    }),
  ],
}
