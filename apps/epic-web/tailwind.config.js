/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
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
    fluidTypography: {},
    extend: {
      fontFamily: {
        sans: ['var(--font-dmsans)', ...defaultTheme.fontFamily.sans],
        // sans: ['Neogrotesk', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-jetbrainsmono)', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        // black: '#0B0617',
        // black: '#000110',
        brand: colors.amber[200],
        // gray: {
        //   50: '#FBFBFC',
        //   100: '#EFEEF1',
        //   200: '#D7D5DD',
        //   300: '#BEBBC9',
        //   400: '#A6A2B4',
        //   500: '#8E88A0',
        //   600: '#766F8B',
        //   700: '#605B71',
        //   800: '#4A4658',
        //   900: '#35323E',
        //   950: '#292730',
        // },
        gray: {
          ...colors.gray,
          950: '#080B16',
        },
      },
      screens: {
        '2xl': '1820px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            'h1, h2, h3, h4': {
              color: theme('colors.gray.900'),
            },
            'code::before': {
              content: "''",
            },
            'code::after': {
              content: "''",
            },
            code: {
              fontSize: theme('fontSize.sm'),
              padding: theme('spacing.1'),
              borderRadius: theme('borderRadius.sm'),
              color: theme('colors.gray.800'),
              backgroundColor: theme('colors.gray.200'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.200'),
            'h1, h2, h3, h4': {
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-fluid-typography'),
    require('tailwind-scrollbar'),
    require('tailwindcss-radix'),
  ],
}
