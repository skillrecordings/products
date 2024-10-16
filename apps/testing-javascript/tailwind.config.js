/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

const fontLight = 'TT Commons W01 Light'
const fontRegular = 'TT Commons W01 Regular'
const fontMedium = 'TT Commons W01 Medium'
const fontDemiBold = 'TT Commons W01 DemiBold'

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
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
      },
    },
    extend: {
      fontFamily: {
        sans: [fontRegular, ...defaultTheme.fontFamily.sans],
        'tt-light': fontLight,
        'tt-regular': fontRegular,
        'tt-medium': fontMedium,
        'tt-demibold': fontDemiBold,
      },
      colors: {
        body: '#1b1b1f',
        'tjs-green': '#3ac0c0',
        'tjs-orange': '#ffa82e',
        'tjs-yellow': '#ffe4a4',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            'h1, h2, h3': {
              fontFamily: fontMedium,
              fontWeight: theme('fontWeight.normal'),
            },
            a: {
              color: '#1b1b1f',
              borderBottom: '2px solid #ffe4a4',
              textDecoration: 'none',
              transitionDuration: '200ms',
              '&:hover': {
                backgroundColor: '#ffe4a4',
              },
            },
            ul: {
              listStyle: 'none',
              padding: 0,
              li: {
                padding: 0,
                marginTop: '20px',
                marginBottom: '10px',
                'p, span': {
                  marginTop: 0,
                  marginBottom: 0,
                },
                svg: {
                  marginTop: '6px',
                  marginBottom: 0,
                },
              },
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
          },
        },
        md: {
          css: {
            fontSize: '1.375rem',
            lineHeight: '2rem',
            ul: {
              li: {
                marginTop: '20px',
                marginBottom: '10px',
                svg: {
                  marginTop: '4px',
                },
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-radix')],
}
