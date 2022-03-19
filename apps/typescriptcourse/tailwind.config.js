const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

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
        // black: '#06070A',
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
            '*': {color: theme('colors.white')},
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({addVariant}) => {
      addVariant('supports-backdrop-blur', '@supports (backdrop-filter: none)')
      addVariant('firefox', '@supports (-moz-appearance: none)')
      addVariant('safari', '@supports selector(:nth-child(1 of x))')
    }),
  ],
}
