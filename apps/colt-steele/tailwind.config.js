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
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
        serif: ['Marbach', ...defaultTheme.fontFamily.serif],
        heading: ['Coranto Headline', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        gray: colors.stone,
        brand: {
          red: '#DC6D53',
          yellow: '#DBA856',
          bone: '#E0DEC5',
          cultured: '#F8F7F3',
          cola: '#383529',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            code: {
              background: theme('colors.white'),
              borderRadius: theme('borderRadius.md'),
              boxShadow: `0px 0.3px 2.4px rgba(0, 0, 0, 0.02), 0px 0.8px 5.9px rgba(0, 0, 0, 0.028), 0px 1.5px 11px rgba(0, 0, 0, 0.035), 0px 2.7px 19.7px rgba(0, 0, 0, 0.042), 0px 5px 36.8px rgba(0, 0, 0, 0.05), 0px 12px 88px rgba(0, 0, 0, 0.07)`,
              padding: `3px 5px`,
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({addComponents}) {
      addComponents({
        '.prose h1': {color: colors.stone[800]},
        '.prose h2': {color: colors.stone[800]},
        '.prose h3': {color: colors.stone[800]},
        '.prose h4': {color: colors.stone[800]},
        '.prose h5': {color: colors.stone[800]},
        '.prose h6': {color: colors.stone[800]},
      })
    },
    require('tailwind-scrollbar'),
    require('tailwindcss-radix'),
  ],
}
