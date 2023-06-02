'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import {cva, type VariantProps} from 'class-variance-authority'
import {useTheme} from '../hooks/use-theme'

import {cn} from './utils'

export const defaultLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof defaultLabelVariants>
>(({className, ...props}, ref) => {
  const {labelVariants} = useTheme()
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants && labelVariants(), className)}
      {...props}
    />
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export {Label}
