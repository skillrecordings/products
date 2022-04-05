const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.tsx',
    './src/**/*.mdx',
    './node_modules/@skillrecordings/commerce/dist/**/*.js',
    './node_modules/@skillrecordings/react/dist/**/*.js',
    './node_modules/@skillrecordings/convertkit/dist/**/*.js',
    './node_modules/@skillrecordings/quiz/dist/**/*.js',
    './node_modules/@skillrecordings/player/dist/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
        sicret: ['Sicret Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: '#3b82f6',
        gray: {
          50: '#FFF',
          100: '#FAFAFA',
          200: '#EAEAEA',
          300: '#999',
          400: '#888',
          500: '#666',
          600: '#444',
          700: '#333',
          800: '#111',
          900: '#000',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: theme('colors.blue.300'),
              },
              code: {color: '#3b82f6'},
            },
            code: {
              padding: '3px 5px',
              fontSize: '90% !important',
              borderRadius: 5,
              background: theme('colors.gray.100'),
              fontFamily: "'IBM Plex Mono' !important",
            },
            'code::before': {
              content: "''",
            },
            'code::after': {
              content: "''",
            },
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: theme('colors.blue.300'),
              },
              code: {color: '#3b82f6'},
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              color: theme('colors.gray.300'),
            },
            'h2,h3,h4': {
              color: theme('colors.gray.100'),
            },
            code: {
              padding: '3px 5px',
              fontSize: '90% !important',
              borderRadius: 5,
              color: theme('colors.white'),
              background: theme('colors.gray.700'),
              fontFamily: "'Input Mono' !important",
            },
            'pre > code': {
              background: 'none',
              padding: 0,
            },
            hr: {borderColor: theme('colors.gray.700')},
            ol: {
              li: {
                '&:before': {color: theme('colors.gray.500')},
              },
            },
            ul: {
              li: {
                '&:before': {backgroundColor: theme('colors.gray.500')},
              },
            },
            strong: {color: theme('colors.gray.100')},
          },
        },
      }),
    },
  },
  variants: {
    typography: ['dark'],
  },
  plugins: [require('@tailwindcss/typography')],
}
