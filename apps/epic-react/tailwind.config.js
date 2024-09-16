const colors = require('tailwindcss/colors')
const {fontFamily} = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.tsx',
    './src/**/*.mdx',
    './node_modules/@skillrecordings/commerce/dist/**/*.js',
    './node_modules/@skillrecordings/react/dist/**/*.js',
    './node_modules/@skillrecordings/convertkit/dist/**/*.js',
    './node_modules/@skillrecordings/ui/primitives/**/*.tsx',
    './node_modules/@skillrecordings/skill-leson/admin/**/*.tsx',
    './node_modules/@skillrecordings/skill-leson/profile/**/*.tsx',
    './node_modules/@skillrecordings/skill-lesson/path-to-purchase/**/*.tsx',
    './node_modules/@skillrecordings/skill-lesson/video/**/*.tsx',
  ],
  theme: {
    extend: {
      screens: {
        '2xl': '1820px',
      },
      textColor: {
        text: 'var(--color-text-text)',
        'er-primary': 'var(--color-text-primary)',
        react: 'var(--color-react)',
      },
      backgroundColor: {
        // background: 'hsl(var(--background))',
        navigation: 'var(--color-bg-navigation)',
        // black: 'var(--color-bg-black)',
      },
      boxShadow: {
        outline: '0 0 0 3px var(--color-text-primary)',
      },
      colors: {
        gray: colors.slate,
        'cool-gray': 'var(--color-cool-gray)',
        'er-gray': {
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        blue: {
          100: '#EBF1FF',
          200: '#CCDCFF',
          300: '#ADC6FF',
          400: '#709CFF',
          500: '#3371FF',
          600: '#2E66E6',
          700: '#1F4499',
          800: '#173373',
          900: '#0F224D',
        },
        yellow: {
          300: '#faca15',
          400: '#e3a008',
          600: '#9f580a',
          800: '#723b13',
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
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: 'var(--color-gray-900)',
            'h1, h2, h3, h4, blockquote, i, em, strong': {
              color: 'var(--color-text-text)',
            },
            a: {color: 'var(--color-text-primary)'},
            code: {
              color: 'var(--color-text)',
              padding: '2px 3px',
              background: 'var(--color-gray-200)',
              borderRadius: 3,
            },
            pre: {margin: '0px'},
          },
        },
        invert: {
          css: {
            color: '#E3EBFF', // '#CFDBFC',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
    require('tailwindcss-radix'),
    require('tailwindcss-animate'),
    require('tailwindcss-group-modifier-plugin'),
  ],
}
