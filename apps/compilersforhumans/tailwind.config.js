const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const tailwindCommonConfig = require('@skillrecordings/scripts/tailwind.config')

module.exports = {
  ...tailwindCommonConfig,
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Neue Montreal', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...colors,
        black: colors.gray['900'],
      },
      screens: {
        print: {raw: 'print'},
      },
      dropShadow: {
        white: [
          '0 5px 30px rgba(255, 255, 255, 0.1)',
          '0 2px 10px rgba(255, 255, 255, 0.2)',
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            code: {
              // color: theme('colors.gray.200'),
              padding: '0.3rem 0.5rem 0.4rem',

              borderRadius: theme('borderRadius.sm'),
            },
            'code:before': {
              content: '""',
            },
            'code:after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.100'),
            '*': {color: theme('colors.gray.100')},
            strong: {color: theme('colors.gray.100')},
            'h1, h2, h3, h4': {
              color: theme('colors.gray.100'),
            },
            a: {
              color: theme('colors.violet.300'),
              '&:hover': {
                color: theme('colors.violet.200'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-autofill'),
    require('tailwindcss-text-fill'),
  ],
}
