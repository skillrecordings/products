const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  // important: true,
  purge: {
    content: [
      './src/**/*.tsx',
      './src/**/*.mdx',
      './node_modules/commerce/**/*.js',
      './node_modules/react/**/*.js',
      './node_modules/convertkit/**/*.js',
    ],
  },
  theme: {
    extend: {
      colors: {
        ...colors,
        gray: colors.blueGray,
        orange: {
          50: '#fff6f0',
          100: '#feeee1',
          200: '#fedcbe',
          300: '#feba77',
          400: '#fe901b',
          500: '#d17300',
          600: '#a16108',
          700: '#794d0b',
          800: '#5d400e',
          900: '#543e12',
        },
      },
      screens: {
        print: {raw: 'print'},
      },
      fontFamily: {
        din: ['DIN Condensed', ...defaultTheme.fontFamily.sans],
        souvenir: ['ITC Souvenir', ...defaultTheme.fontFamily.serif],
        brandon: ['Brandon Text', ...defaultTheme.fontFamily.serif],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.white'),
            fontFamily: theme('fontFamily.brandon').join(', '),
            code: {
              color: theme('colors.white'),
            },
            a: {
              color: theme('colors.rose.600'),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            strong: {color: theme('colors.gray.50')},
            a: {
              color: theme('colors.orange.200'),
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
