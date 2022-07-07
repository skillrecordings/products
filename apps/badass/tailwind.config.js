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
        black: '#040308',
        badass: {
          blue: '#3E3EFF',
          purple: '#8B00FF',
          plum: '#2E1131',
          gray: '#BDBDBD',
          yellow: {
            300: '#FDB854',
            500: '#F7A216',
            700: '#C17400',
            900: '#392306',
          },
          neutral: {
            500: '#4958B4',
            600: '#3A458A',
            700: '#272353',
            800: '#292544',
            900: '#181431',
            1000: '#040308',
          },
          green: {
            400: '#A3FFC1',
            500: '#2BC370',
            600: '#1D8046',
            700: '#134D2A',
            800: '#041E0E',
          },
          cyan: {
            400: '#B8F7FF',
            500: '#88D4DD',
            600: '#62ACB6',
          },
          red: {
            400: '#FF6D46',
            500: '#FF4101',
            800: '#AC1E00',
            900: '#AE000C',
          },
          pink: {
            300: '#FFE0E4',
            400: '#FBC7CC',
            500: '#F8ABB5',
            600: '#FE8BA9',
            800: '#B12044',
          },
        },
      },
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
        symbol: ['Espiritu Dingbats', ...defaultTheme.fontFamily.sans],
        condensed: ['Espiritu Condensed', ...defaultTheme.fontFamily.sans],
        script: ['Espiritu Script', ...defaultTheme.fontFamily.sans],
        heading: ['Espiritu Regular', ...defaultTheme.fontFamily.sans],
        expanded: ['Espiritu Expanded', ...defaultTheme.fontFamily.sans],
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
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
