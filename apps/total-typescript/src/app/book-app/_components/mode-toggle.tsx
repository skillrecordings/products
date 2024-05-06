'use client'

import React from 'react'
import {toggleMode} from './toggle-book-mode'
import {Switch} from '@skillrecordings/ui/primitives/switch'
import {Label} from '@skillrecordings/ui/primitives/label'
import {cn} from '@skillrecordings/ui/utils/cn'

const ModeToggle = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{mode: 'book' | 'video'; disabled?: boolean}>
>(({children, disabled, mode, ...props}, ref) => {
  return (
    <>
      <Label
        className={cn('flex items-center space-x-2', {
          'cursor-not-allowed': disabled,
          'cursor-pointer': !disabled,
        })}
      >
        <span>Book</span>
        <Switch
          className="data-[state=unchecked]:bg-white/10"
          disabled={disabled}
          checked={mode === 'video'}
          id="mode"
          onClick={async () => {
            await toggleMode()
          }}
          {...props}
        />
        <span>Video</span>
      </Label>
    </>
  )
})

export default ModeToggle
