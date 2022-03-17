const defaultTheme = require('tailwindcss/defaultTheme')

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
        fibra: ['Fibra One', ...defaultTheme.fontFamily.sans],
        typold: ['Typold', ...defaultTheme.fontFamily.sans],
        sicret: ['Sicret Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: '#3b82f6',
        gray: {
          10: '#FFF',
          50: '#FAFAFA',
          100: '#EAEAEA',
          200: '#999',
          300: '#888',
          400: '#777',
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
            code: {color: theme('colors.pink.500')},
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
