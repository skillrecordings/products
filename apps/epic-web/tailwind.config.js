/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./app/**/**.{ts,tsx}'],
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
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-fluid-typography'),
  ],
}
