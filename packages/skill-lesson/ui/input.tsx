import * as React from 'react'

import {cn} from './utils'
import {useTheme} from '../hooks/use-theme'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, ...props}, ref) => {
    const {input: inputTheme} = useTheme()

    return (
      <input
        type={type}
        className={cn(inputTheme, className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export {Input}
