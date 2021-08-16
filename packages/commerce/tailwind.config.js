const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  purge: {
    content: ['./src/**/*.tsx', './src/**/*.mdx'],
  },
  theme: {
    extend: {
      colors: {
        ...colors,
      },
      screens: {
        print: {raw: 'print'},
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.rose.600'),
            },
            h1: {
              paddingTop: '1.25em',
            },
            'h1:first-of-type': {
              paddingTop: 0,
            },
          },
        },
        dark: {
          css: {
            '*': {color: theme('colors.white')},
            a: {
              color: theme('colors.rose.300'),
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
