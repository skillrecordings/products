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
    fluidTypography: {},
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
        mono: ['Azeret Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: colors.amber[200],
        gray: colors.zinc,
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '*': {color: theme('colors.yellow.50')},
            color: theme('colors.yellow.50'),
            a: {
              color: `${theme('colors.brand')} !important`,
              textDecoration: 'none !important',
            },
            'a:hover': {
              textDecoration: 'underline !important',
            },
            ol: {
              'li::marker': {color: theme('colors.brand')},
            },
            ul: {
              'li::marker': {color: theme('colors.brand')},
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              background: theme('colors.gray.700'),
              padding: '1px 3px',
              borderRadius: 3,
              fontSize: '80% !important',
              fontWeight: 500,
              color: theme('colors.white'),
            },
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-fluid-typography'),
    require('tailwind-scrollbar'),
  ],
}
