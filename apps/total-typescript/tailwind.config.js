const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.tsx',
    './src/**/*.mdx',
    './node_modules/@skillrecordings/react/dist/**/*.js',
    './node_modules/@skillrecordings/convertkit/dist/**/*.js',
    './node_modules/@skillrecordings/quiz/dist/**/*.js',
    './node_modules/@skillrecordings/player/dist/**/*.js',
    './node_modules/@skillrecordings/ui/primitives/**/*.tsx',
    './node_modules/@skillrecordings/skill-leson/admin/**/*.tsx',
    './node_modules/@skillrecordings/skill-leson/profile/**/*.tsx',
    './node_modules/@skillrecordings/skill-lesson/path-to-purchase/**/*.tsx',
    './node_modules/@skillrecordings/skill-lesson/video/**/*.tsx',
  ],
  theme: {
    fluidTypography: {
      lineHeight: 1.8,
      maxTypeScale: 1.5,
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        heading: ['var(--font-magnat-head)', ...defaultTheme.fontFamily.sans],
        text: ['var(--font-magnat-text)', ...defaultTheme.fontFamily.sans],
        sans: ['var(--font-larsseit)', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
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
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        gray: colors.slate,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        salmon: {
          DEFAULT: 'hsl(7 100% 75%)',
          foreground: 'hsl(7 100% 85%)',
          background: 'hsl(7 100% 75%)',
        },
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
      },
      screens: {
        '2xl': '1820px',
      },
      typography: (theme) => ({
        light: {
          css: {
            color: theme('colors.foreground'),
            'h1, h2, h3, h4': {
              color: theme('colors.foreground'),
            },
            li: {
              color: theme('colors.foreground'),
            },
            code: {
              background: theme('colors.gray.100'),
              color: theme('colors.foreground'),
            },
            'pre > code': {
              background: 'none',
            },
            'p > code': {
              fontSize: '80% !important',
            },
            a: {
              color: theme('colors.foreground'),
              textDecoration: 'underline',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
            p: {
              color: theme('colors.foreground'),
            },
            strong: {
              color: theme('colors.foreground'),
            },
            'code::before': {
              content: "''",
            },
            'code::after': {
              content: "''",
            },
          },
        },
        DEFAULT: {
          css: {
            color: theme('colors.white'),
            code: {color: theme('colors.white')},
            'h1, h2, h3, h4': {
              color: theme('colors.gray.100'),
            },
            li: {
              color: theme('colors.gray.300'),
            },
            a: {
              color: theme('colors.primary.DEFAULT'),
              textDecoration: 'none',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
            p: {
              color: theme('colors.gray.300'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.DEFAULT'),
            },
            'blockquote > p::before': {
              color: theme('colors.white'),
            },
            'blockquote > p::after': {
              color: theme('colors.white'),
            },
            strong: {
              color: theme('colors.gray.200'),
            },
            'code::before': {
              content: "''",
            },
            'code::after': {
              content: "''",
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-fluid-typography'),
    require('tailwind-scrollbar'),
    require('tailwindcss-radix'),
    require('tailwindcss-animate'),
  ],
}
