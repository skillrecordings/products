'use client'

import * as React from 'react'
import {Sun, Moon} from '@/components/icons'
import {useTheme} from 'next-themes'
import {Button} from '@skillrecordings/ui'

export function ThemeToggle() {
  const {theme, setTheme} = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light')
      }}
    >
      {theme === 'light' ? <Moon /> : <Sun />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
