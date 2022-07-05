const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const tailwindCommonConfig = require('@skillrecordings/scripts/tailwind.config')

module.exports = {
  ...tailwindCommonConfig,
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
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
            'h1, h2, h3, h4': {
              color: theme('colors.white'),
            },
            strong: {color: theme('colors.gray.50')},
            a: {
              color: theme('colors.orange.300'),
            },
            'a:hover': {
              color: theme('colors.orange.200'),
            },
            hr: {
              borderColor: theme('colors.gray.800'),
            },
          },
        },
        xl: {
          css: {
            'p, ul': {
              marginBottom: defaultTheme.spacing['10'],
            },
            li: {
              marginBottom: defaultTheme.spacing['4'],
            },
            h2: {
              fontFamily: theme('fontFamily.din').join(', '),
              textTransform: 'uppercase',
              fontSize: theme('fontSize.5xl'),
              textAlign: 'center',
              padding: `${defaultTheme.spacing['8']} ${defaultTheme.spacing['16']}`,
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
