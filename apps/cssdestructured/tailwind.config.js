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
          text: '#FFF8EB',
          cream: '#EFDFC4',
          yellow: '#EFD7B1',
          mustard: '#E5A375',
          brightYellow: '#FFC075',
          red: '#D44B36',
          orange: '#DA6E47',
          turqoise: '#7BA69C',
          blue: '#152549',
        },
        background: '#152549',
      },
      zIndex: {
        noise: 10,
      },
      screens: {
        print: {raw: 'print'},
      },
      fontFamily: {
        sans: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
        serif: ['BlanchSage', ...defaultTheme.fontFamily.serif],
        display: ['LeoRounded', ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '*, h1, h2, h3, h4, li, blockquote, strong, code': {
              color: theme('colors.brand.text'),
            },
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.serif').join(', '),
              textAlign: 'center',
              lineHeight: '0.6 !important',
            },
            h1: {
              fontSize: '500% !important',
            },
            h2: {
              fontSize: '400% !important',
            },
            h3: {
              fontSize: '330% !important',
            },
            a: {
              color: theme('colors.brand.brightYellow'),
              textDecoration: 'underline',
            },
            ul: {
              padding: '1rem 0',
            },
            'ul > li:before': {
              content: '"✦"',
              top: '0.33em',
              width: '0 !important',
              color: theme('colors.brand.brightYellow'),
              fontSize: theme('fontSize.xs'),
            },
            pre: {
              background: 'transparent',
              margin: '0px !important',
            },
          },
        },
        dark: {
          css: {},
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
