const defaultTheme = require('tailwindcss/defaultTheme')

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`

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
        black: '#202040',
      },
      fontFamily: {
        sans: ['Public Sans', ...defaultTheme.fontFamily.sans],
      },
      lineHeight: {
        tighter: '1.1',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            p: {
              marginTop: em(20, 16),
              marginBottom: em(20, 16),
            },
            h1: {
              fontSize: em(36, 16),
              marginTop: '0',
              marginBottom: em(32, 36),
              lineHeight: round(40 / 36),
            },
            h2: {
              fontSize: em(24, 16),
              marginTop: em(48, 24),
              marginBottom: em(24, 24),
              lineHeight: round(32 / 24),
            },
            h3: {
              fontSize: em(20, 16),
              marginTop: em(32, 20),
              marginBottom: em(12, 20),
              lineHeight: round(32 / 20),
            },
            h4: {
              marginTop: em(24, 16),
              marginBottom: em(8, 16),
              lineHeight: round(24 / 16),
            },
            video: {
              marginTop: em(32, 16),
              marginBottom: em(32, 16),
            },
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'underline',
              transition: 'all 150ms ease-in-out',
            },
            'a:hover': {
              color: theme('colors.blue.700'),
              transition: 'all 150ms ease-in-out',
            },
            'h1,h2,h4,h5': {
              color: theme('colors.gray.800'),
              fontFamily: theme('fontFamily.sans').join(', '),
            },
            pre: {
              backgroundColor: '#011627',
              color: theme('colors.white'),
              overflow: 'auto',
            },
            code: {
              fontSize: '80%',
              background: theme('colors.gray.100'),
              padding: '3px 5px',
              borderRadius: 5,
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        lg: {
          css: {
            p: {
              marginTop: em(24, 18),
              marginBottom: em(24, 18),
            },
            h1: {
              fontSize: em(48, 18),
              marginTop: '0',
              marginBottom: em(40, 48),
              lineHeight: round(48 / 48),
            },
            h2: {
              fontSize: em(30, 18),
              marginTop: em(64, 30),
              marginBottom: em(32, 30),
              lineHeight: round(40 / 30),
              fontWeight: '800',
            },
            h3: {
              fontSize: em(24, 18),
              marginTop: em(48, 24),
              marginBottom: em(16, 24),
              lineHeight: round(36 / 24),
              fontWeight: '800',
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
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-autofill'),
    require('tailwindcss-text-fill'),
  ],
}
