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
      colors: {
        black: '#202040',
      },
      fontFamily: {
        sans: ['Aestetico', ...defaultTheme.fontFamily.sans],
        serif: ['Ahkio', ...defaultTheme.fontFamily.serif],
      },
      lineHeight: {
        tighter: '1.1',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: `${theme('colors.blue.600')} !important`,
              textDecoration: 'underline',
              transition: 'all 150ms ease-in-out',
            },
            'a:hover': {
              color: `${theme('colors.blue.700')} !important`,
              transition: 'all 150ms ease-in-out',
            },
            'h1,h2,h4,h5': {
              color: `${theme('colors.black')} !important`,
            },
            pre: {
              backgroundColor: '#011627',
              color: `${theme('colors.white')}`,
              overflow: 'auto',
            },
            code: {
              fontSize: '80% !important',
              background: theme('colors.gray.100'),
              padding: '3px 5px',
              borderRadius: 5,
            },
            'code::before': {
              content: '"" !important',
            },
            'code::after': {
              content: '"" !important',
            },
          },
        },
        dark: {
          css: {},
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
