'use client'

import {useMedia} from 'react-use'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'
import {useTheme} from 'next-themes'

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import {Sun, Moon} from '@/components/icons'

export default () => {
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
                'w-auto border-none px-3 py-2 text-base text-text transition-opacity duration-150 ease-in-out hover:bg-transparent hover:opacity-100 md:px-2',
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
