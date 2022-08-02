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
    './node_modules/@skillrecordings/react/dist/**/*.js',
    './node_modules/@skillrecordings/convertkit/dist/**/*.js',
    './node_modules/@skillrecordings/quiz/dist/**/*.js',
    './node_modules/@skillrecordings/player/dist/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        sand: {
          DEFAULT: '#F6F4F1',
          50: '#F6F4F1',
          100: '#EBE6E0',
          200: '#D5CBBE',
          300: '#BFAE9C',
          400: '#A99179',
          500: '#8F735C',
          600: '#6D5646',
          700: '#4A3A30',
          800: '#281F1A',
          900: '#060504',
        },
        moss: {
          DEFAULT: '#E9EBE2',
          50: '#F2F3EE',
          100: '#E9EBE2',
          200: '#D0D4C1',
          300: '#B7BDA0',
          400: '#9DA67E',
          500: '#828C61',
          600: '#636B4A',
          700: '#454A33',
          800: '#26281C',
          900: '#070705',
        },
        orange: {
          DEFAULT: '#E3432B',
          50: '#FDF7F1',
          100: '#FBEBDF',
          200: '#F6D1BB',
          300: '#F1B397',
          400: '#ED9173',
          500: '#E86C4F',
          600: '#E3432B',
          700: '#BD2519',
          800: '#8B1412',
          900: '#5A0C10',
        },
        green: {
          DEFAULT: '#104122',
          50: '#7CDEA1',
          100: '#6CDA95',
          200: '#4BD27D',
          300: '#31C467',
          400: '#29A356',
          500: '#218345',
          600: '#186234',
          700: '#104122',
          800: '#0A2915',
          900: '#041009',
        },
      },
      fontFamily: {
        heading: ['aglet-slab', ...defaultTheme.fontFamily.serif],
        display: ['canada-type-gibson', ...defaultTheme.fontFamily.sans],
        sans: ['neue-haas-grotesk-text', ...defaultTheme.fontFamily.sans],
        nav: ['dinosaur', ...defaultTheme.fontFamily.sans],
      },
      lineHeight: {
        tighter: '1.1',
      },
      backgroundImage: {
        noise: "url('/assets/noise@2x.png')",
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
              marginTop: em(48, 36),
              marginBottom: em(32, 36),
              lineHeight: round(40 / 36),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            h2: {
              fontSize: em(24, 16),
              marginTop: em(48, 24),
              marginBottom: em(24, 24),
              lineHeight: round(32 / 24),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            h3: {
              fontSize: em(20, 16),
              marginTop: em(32, 20),
              marginBottom: em(12, 20),
              lineHeight: round(32 / 20),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            h4: {
              marginTop: em(24, 16),
              marginBottom: em(8, 16),
              lineHeight: round(24 / 16),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            video: {
              marginTop: em(32, 16),
              marginBottom: em(32, 16),
            },
            a: {
              color: theme('colors.green.500'),
              textDecoration: 'underline',
              transition: 'all 150ms ease-in-out',
            },
            'a:hover': {
              color: theme('colors.green.600'),
              background: theme('colors.moss.50'),
              transition: 'all 150ms ease-in-out',
            },
            'h1, h2, h3, h4, h5': {
              color: theme('colors.gray.800'),
              fontFamily: theme('fontFamily.heading').join(', '),
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
              marginTop: em(56, 48),
              marginBottom: em(40, 48),
              lineHeight: round(48 / 48),
            },
            h2: {
              fontSize: em(32, 18),
              marginTop: em(72, 30),
              marginBottom: em(32, 30),
              lineHeight: round(36 / 30),
              fontWeight: '600',
            },
            h3: {
              fontSize: em(28, 18),
              marginTop: em(48, 24),
              marginBottom: em(16, 24),
              lineHeight: round(32 / 24),
              fontWeight: '600',
            },
            h4: {
              fontSize: em(22, 18),
              marginTop: em(20, 18),
              marginBottom: em(8, 18),
              lineHeight: round(22 / 18),
            },
            figure: {
              marginTop: em(24, 16),
            },
            '.video': {
              marginTop: em(48, 16),
              marginBottom: em(48, 16),
            },
          },
        },
        xl: {
          css: {
            fontSize: rem(20),
            lineHeight: round(36 / 20),
            p: {
              marginTop: em(24, 20),
              marginBottom: em(24, 20),
            },
            h1: {
              fontSize: em(56, 20),
              marginTop: '0',
              marginBottom: em(48, 56),
              lineHeight: round(56 / 56),
            },
            h2: {
              fontSize: em(40, 20),
              marginTop: em(56, 36),
              marginBottom: em(32, 36),
              lineHeight: round(40 / 36),
            },
            h3: {
              fontSize: em(36, 20),
              marginTop: em(48, 30),
              marginBottom: em(20, 30),
              lineHeight: round(40 / 30),
            },
            h4: {
              fontSize: em(30, 20),
              marginTop: em(36, 20),
              marginBottom: em(12, 20),
              lineHeight: round(24 / 20),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
