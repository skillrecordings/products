'use client'

import React from 'react'
import {toggleMode} from './toggle-book-mode'

const ModeToggle = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
  ({children, ...props}, ref) => {
    return (
      <>
        <form action={toggleMode}>
          <button ref={ref} {...props} type="submit">
            {children}
          </button>
        </form>
      </>
    )
  },
)

export default ModeToggle
