import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'
import {defaultButtonVariants} from './button'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const defaultTheme = {
  buttonVariants: defaultButtonVariants,
  input:
    'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
}
