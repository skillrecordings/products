const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const tailwindCommonConfig = require('@skillrecordings/scripts/tailwind.config')

module.exports = {
  ...tailwindCommonConfig,
  theme: {
    extend: {
      colors: {
        ...colors,
        gray: colors.coolGray,
        primary: colors.blue,
      },
      fontFamily: {
        sans: ['Aestetico', ...defaultTheme.fontFamily.sans],
        hand: ['Pinto', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        print: {raw: 'print'},
      },
      boxShadow: {
        smooth:
          '0 4.5px 3.6px -8px rgba(0, 0, 0, 0.01), 0 12.5px 10px -8px rgba(0, 0, 0, 0.015), 0 30.1px 24.1px -8px rgba(0, 0, 0, 0.02), 0 100px 80px -8px rgba(0, 0, 0, 0.03)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            a: {
              color: theme('colors.primary.600'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
