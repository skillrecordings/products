'use client'

import React from 'react'

const ModeToggle = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    mode: 'video' | 'book'
    toggleMode: () => void
  }>
>(({children, mode, toggleMode, ...props}, ref) => {
  return (
    <>
      <form action={toggleMode}>
        <button ref={ref} {...props} type="submit">
          {children}
        </button>
      </form>
    </>
  )
})

export default ModeToggle
