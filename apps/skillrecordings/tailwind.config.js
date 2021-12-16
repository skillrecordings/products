const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

const containerStylesPlugin = ({addComponents}) =>
  addComponents({
    '.container': {
      maxWidth: '768px',
    },
  })
const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`

module.exports = {
  content: ['./src/**/*.tsx', './src/**/*.mdx'],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          md: '1.5rem',
        },
      },
      colors: {
        gray: colors.zinc,
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Trailers', ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '*': {color: theme('colors.gray.900')},
            'p, li': {color: theme('colors.gray.700')},

            'blockquote p': {
              margin: '0 !important',
            },
            'blockquote p::before': {
              content: 'none',
            },
            'blockquote p::after': {
              content: 'none',
            },
            strong: {
              fontWeight: 'bold',
            },
          },
        },
        dark: {
          css: {
            '*': {color: theme('colors.gray.100')},
            'p, li': {color: theme('colors.gray.300')},
          },
        },
        lg: {
          css: {
            fontSize: rem(18),
            lineHeight: round(34 / 18),
            p: {
              marginTop: em(28, 18),
              marginBottom: em(28, 18),
            },
            blockquote: {
              marginTop: em(48, 24),
              marginBottom: em(48, 24),
            },
            '.contributor-profile-box': {
              marginTop: em(48, 24),
              marginBottom: em(48, 24),
            },
            h1: {
              fontSize: em(48, 18),
              marginTop: '0',
              marginBottom: em(40, 48),
              lineHeight: round(48 / 48),
            },
            h2: {
              fontSize: em(30, 18),
              marginTop: em(96, 30),
              marginBottom: em(32, 30),
              lineHeight: round(40 / 30),
            },
            h3: {
              fontSize: em(24, 18),
              marginTop: em(56, 24),
              marginBottom: em(24, 24),
              lineHeight: round(36 / 26),
            },
            h4: {
              marginTop: em(32, 18),
              marginBottom: em(8, 18),
              lineHeight: round(28 / 18),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), containerStylesPlugin],
}
