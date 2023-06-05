import {cva, type VariantProps} from 'class-variance-authority'

export const theme = {
  variants: {
    button: cva(
      'relative inline-flex items-center justify-center rounded-md text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
      {
        variants: {
          variant: {
            default: 'bg-primary button-primary-border text-primary-foreground',
            destructive:
              'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline:
              'border border-input hover:bg-accent hover:text-accent-foreground',
            secondary:
              'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'underline-offset-4 hover:underline text-primary',
          },
          size: {
            default: 'h-10 py-2 px-4',
            sm: 'h-9 px-3 rounded-md',
            lg: 'h-12 px-8 rounded-md',
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      },
    ),
    input: cva(''),
    label: cva(''),
  },
}
