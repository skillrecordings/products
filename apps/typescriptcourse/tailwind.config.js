const defaultTheme = require('tailwindcss/defaultTheme')

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
        black: '#06070A',
        player: {
          bg: '#20222b',
          primary: '#8b84ff',
        },
      },
      fontFamily: {
        heading: ['Greycliff', ...defaultTheme.fontFamily.sans],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
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
              color: theme('colors.player.primary'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
