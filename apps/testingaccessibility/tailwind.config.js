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
