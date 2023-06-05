import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import {cva, type VariantProps} from 'class-variance-authority'
import {useTheme} from '../hooks/use-theme'

import {cn} from './utils'

const defaultLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof defaultLabelVariants>
>(({className, ...props}, ref) => {
  const {variants} = useTheme()

  return (
    <LabelPrimitive.Root
      data-sr-label=""
      ref={ref}
      className={cn(defaultLabelVariants(), variants.label(), className)}
      {...props}
    />
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export {Label, defaultLabelVariants}
