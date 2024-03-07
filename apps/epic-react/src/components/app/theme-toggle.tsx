'use client'

import * as React from 'react'
import {Sun, Moon} from '@/components/icons'
import {useTheme} from 'next-themes'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'

export function ThemeToggle() {
  const {theme, setTheme} = useTheme()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setTheme(theme === 'light' ? 'dark' : 'light')
            }}
            className="border-none p-2 opacity-75 transition-opacity duration-150 ease-in-out hover:bg-transparent hover:opacity-100"
          >
            {theme === 'light' ? <Moon /> : <Sun />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Activate {theme === 'light' ? 'Dark' : 'Light'} Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
