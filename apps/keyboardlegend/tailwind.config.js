const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const tailwindCommonConfig = require('@skillrecordings/scripts/tailwind.config')

module.exports = {
  ...tailwindCommonConfig,
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...colors,
        brand: {
          pink: {
            50: '#fff8fa',
            100: '#fff1f6',
            200: '#ffdce8',
            300: '#ffc7d9',
            400: '#ff9ebd',
            500: '#ff74a1',
            600: '#e66891',
            700: '#bf5779',
            800: '#994661',
            900: '#7d394f',
          },
        },
      },
      screens: {
        print: {raw: 'print'},
      },
      fontFamily: {
        sans: ['Rubik', ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.brand.pink.500'),
            },
          },
        },
        dark: {
          css: {
            '*': {color: theme('colors.white')},
            a: {
              color: theme('colors.brand.pink.300'),
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
    require('tailwindcss-autofill'),
    require('tailwindcss-text-fill'),
  ],
}
