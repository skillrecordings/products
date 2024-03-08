'use client'

import * as React from 'react'
import {useMedia} from 'react-use'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'

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
  const isTablet = useMedia('(max-width: 920px)', false)
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
            className={twMerge(
              cx(
                'w-auto border-none p-2 px-3 text-base text-text transition-opacity duration-150 ease-in-out hover:bg-transparent hover:opacity-100',
                {
                  'opacity-100': isTablet,
                  'opacity-75': !isTablet,
                },
              ),
            )}
          >
            {isTablet ? (
              `Activate ${theme === 'light' ? 'Dark' : 'Light'} Mode`
            ) : theme === 'light' ? (
              <Moon />
            ) : (
              <Sun />
            )}
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
