const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{tsx,mdx,ts,js,jsx}',
    './node_modules/@skillrecordings/commerce/dist/**/*.js',
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
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
        serif: ['Marbach', ...defaultTheme.fontFamily.serif],
        heading: ['Coranto Headline', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        gray: colors.stone,
        brand: {
          red: '#DC6D53',
          yellow: '#DBA856',
          bone: '#E0DEC5',
          cultured: '#F8F7F3',
          cola: '#383529',
        },
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
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
      screens: {
        '2xl': '1820px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h1, h2, h3, h4': {
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            code: {
              background: theme('colors.white'),
              borderRadius: theme('borderRadius.md'),
              boxShadow: `0px 0.3px 2.4px rgba(0, 0, 0, 0.02), 0px 0.8px 5.9px rgba(0, 0, 0, 0.028), 0px 1.5px 11px rgba(0, 0, 0, 0.035), 0px 2.7px 19.7px rgba(0, 0, 0, 0.042), 0px 5px 36.8px rgba(0, 0, 0, 0.05), 0px 12px 88px rgba(0, 0, 0, 0.07)`,
              padding: `3px 5px`,
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({addComponents}) {
      addComponents({
        '.prose h1': {color: colors.stone[800]},
        '.prose h2': {color: colors.stone[800]},
        '.prose h3': {color: colors.stone[800]},
        '.prose h4': {color: colors.stone[800]},
        '.prose h5': {color: colors.stone[800]},
        '.prose h6': {color: colors.stone[800]},
      })
    },
    require('tailwind-scrollbar'),
    require('tailwindcss-radix'),
  ],
}
