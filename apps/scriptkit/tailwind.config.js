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
      screens: {
        '2xl': '1820px',
      },
      lineHeight: {
        tighter: 1.1,
      },
      colors: {
        gray: colors.neutral,
      },
      fontFamily: {
        sans: ['Articulat', ...defaultTheme.fontFamily.sans],
        display: ['Lexend', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: '0.65rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '*, code, strong, blockquote': {
              color: theme('colors.gray.200'),
            },
            'h1, h2, h3, h4, h5': {
              color: theme('colors.white'),
            },

            a: {
              color: theme('colors.amber.300'),
            },
            '* > a': {
              color: theme('colors.amber.300'),
            },
            '* > a:hover': {
              textDecoration: 'underline',
            },
            code: {
              background: theme('colors.gray.800'),
              padding: '1px 3px',
              borderRadius: 3,
              fontSize: '85%',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              background: theme('colors.gray.900'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwind-fluid-typography'),
    require('tailwind-scrollbar'),
    require('tailwindcss-radix'),
  ],
}
