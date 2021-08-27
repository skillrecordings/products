const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const tailwindCommonConfig = require('@skillrecordings/scripts/tailwind.config')

module.exports = {
  ...tailwindCommonConfig,
  theme: {
    extend: {
      colors: {
        ...colors,
        gray: {...colors.trueGray, 1000: '#000'},
        amber: {...colors.amber, 1000: '#331c10'},
      },
      fontFamily: {
        sans: ['Koopman', ...defaultTheme.fontFamily.sans],
        // display: ['Greycliff', ...defaultTheme.fontFamily.sans],
        // serif: ['Ahkio', ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontWeight: theme('fontWeight.light'),
            'h1, h2, h3, h4': {
              color: 'inherit',
              fontWeight: theme('fontWeight.bold'),
            },
            'a, strong, code': {
              color: 'inherit',
            },
            all: 'revert',
            'ul > li::before': {
              backgroundColor: theme('colors.amber.400'),
            },
            'ol > li::before': {
              color: theme('colors.amber.400'),
            },
            blockquote: {
              color: 'inherit',
              borderColor: 'inherit',
              // borderColor: theme('colors.amber.400'),
              fontWeight: theme('fontWeight.normal'),
              lineHeight: theme('lineHeight.normal'),
              fontStyle: 'normal',
              fontSize: '120%',
            },
            'blockquote > p:first-of-type::before': {
              content: '""',
            },
            'blockquote > p:last-of-type::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            a: {
              color: theme('colors.indigo.300'),
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
