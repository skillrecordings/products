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
    './node_modules/@skillrecordings/skill-lesson/ui/**/*.tsx',
    './node_modules/@skillrecordings/ui/primitives/**/*.tsx',
    './node_modules/@skillrecordings/ui/module/**/*.tsx',
  ],
  theme: {
    fluidTypography: {},
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-dmsans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-jetbrainsmono)', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: colors.amber[200],
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        gray: {
          ...colors.gray,
          950: '#080B16',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: {height: 0},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: 0},
        },
      },
      screens: {
        '2xl': '1820px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            img: {
              borderRadius: theme('borderRadius.md'),
            },
            color: theme('colors.gray.800'),
            'h1, h2, h3, h4, blockquote': {
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
            'h1, h2, h3, h4, blockquote': {
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
    require('tailwindcss-animate'),
  ],
}
