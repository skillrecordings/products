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
          DEFAULT: '#32744A',
          50: '#8FCFA6',
          100: '#81C99B',
          200: '#64BC84',
          300: '#4BAD6E',
          400: '#3E915C',
          500: '#32744A',
          600: '#275B3A',
          700: '#1C422A',
          800: '#12291A',
          900: '#07100A',
        },
        // green: {
        //   DEFAULT: '#3C5F41',
        //   50: '#AFCCB3',
        //   100: '#A2C5A7',
        //   200: '#89B590',
        //   300: '#70A578',
        //   400: '#5C9163',
        //   500: '#4C7852',
        //   600: '#3C5F41',
        //   700: '#263D29',
        //   800: '#111A12',
        //   900: '#000000',
        // },
        // green: {
        //   DEFAULT: '#2E4227',
        //   50: '#C1CBA7',
        //   100: '#B7C39A',
        //   200: '#A1B481',
        //   300: '#89A567',
        //   400: '#708F54',
        //   500: '#597545',
        //   600: '#435C36',
        //   700: '#2E4227',
        //   800: '#151F12',
        //   900: '#000000',
        // },
      },
      fontFamily: {
        'aglet-slab': ['aglet-slab', ...defaultTheme.fontFamily.serif],
        'aglet-sans': ['aglet-sans', ...defaultTheme.fontFamily.sans],
        chauncy: ['chauncy-pro', ...defaultTheme.fontFamily.serif],
        dinosaur: ['dinosaur', ...defaultTheme.fontFamily.sans],
        sans: ['Public Sans', ...defaultTheme.fontFamily.sans],
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
