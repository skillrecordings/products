const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const tailwindCommonConfig = require('@skillrecordings/scripts/tailwind.config')

module.exports = {
  ...tailwindCommonConfig,
  darkMode: 'class',
  theme: {
    extend: {
      zIndex: {
        '-10': '-10',
      },
      colors: {
        ...colors,
        black: 'rgb(10, 10, 13)',
        gray: {...colors.coolGray, 1000: '#0f1521'},
      },
      screens: {
        print: {raw: 'print'},
      },
      fontFamily: {
        fibra: ['Fibra One', ...defaultTheme.fontFamily.sans],
        typold: ['Typold', ...defaultTheme.fontFamily.sans],
        sicret: ['Sicret Mono', ...defaultTheme.fontFamily.mono],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // fontFamily: theme('fontFamily.fibra').join(', '),
            a: {
              color: theme('colors.blue.600'),
            },
            h1: {
              paddingTop: '1.25em',
            },
            'h1:first-of-type': {
              paddingTop: 0,
            },
            code: {
              padding: '3px 5px',
              fontSize: '80% !important',
              borderRadius: 5,
              background: theme('colors.gray.100'),
              fontFamily: "'Input Mono' !important",
            },
            'code::before': {
              content: "''",
            },
            'code::after': {
              content: "''",
            },
            'pre > code': {
              fontSize: 'inherit !important',
              // background: theme('colors.gray.800'),
              // margin: '0 !important',
              // padding: '0 !important',
            },
          },
        },
        dark: {
          css: {
            '*': {color: theme('colors.white')},
            a: {
              color: theme('colors.blue.400'),
            },
            code: {
              padding: '3px 5px',
              borderRadius: 5,
              color: theme('colors.white'),
              background: theme('colors.gray.800'),
            },
            'pre > code': {
              background: 'none',
              padding: 0,
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
  ],
}
