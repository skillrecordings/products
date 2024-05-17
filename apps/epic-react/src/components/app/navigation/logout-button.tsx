'use client'

import {useMedia} from 'react-use'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'
import {signOut} from 'next-auth/react'

import {Logout} from '@/components/icons'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'

export default () => {
  const isTablet = useMedia('(max-width: 920px)', false)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
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
            {isTablet ? 'Log Out' : <Logout />}
            <span className="sr-only">Log out</span>
          </Button>
        </TooltipTrigger>
        {!isTablet && (
          <TooltipContent>
            <p>Log Out</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}
