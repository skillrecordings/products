const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  // darkMode: 'class',
  purge: {
    content: ['./src/**/*.tsx', './src/**/*.mdx'],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...colors,
        brand: {
          orange: {
            100: '#fffcfb',
            200: '#fff5f2',
            300: '#ffe2d8',
            400: '#ffc4ae',
            500: '#ffa480',
            600: '#ff7137',
            700: '#d64000',
            800: '#942b00',
            900: '#4c1600',
          },
          // orange: '#F74C00',
          gray: '#ECEFF5',
        },
      },
      spacing: {
        'page-sm': defaultTheme.spacing[5],
        'page-md': defaultTheme.spacing[8],
        'page-lg': defaultTheme.spacing[12],
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
