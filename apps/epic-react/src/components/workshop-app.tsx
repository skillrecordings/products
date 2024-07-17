import {cn} from '@skillrecordings/ui/utils/cn'
import React from 'react'
import {motion} from 'framer-motion'
import {CodeIcon, TerminalIcon} from '@heroicons/react/outline'
import {Button} from '@skillrecordings/ui'
import Link from 'next/link'

const WorkshopAppBanner: React.FC<{
  className?: string
  description?: string
  moduleSlug?: string
}> = ({
  className,
  description = 'For the best experience, we highly recommend you use the Epic Web workshop application on your local machine. It allows you to authenticate and work through the material as intended at your own pace.',
  moduleSlug,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="rounded bg-foreground/5 p-5 sm:bg-transparent sm:p-0">
        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-4 text-lg font-bold leading-tight sm:text-xl">
            <WorkshopAppIcon />{' '}
            <Link
              href={`/get-started${moduleSlug ? `?module=${moduleSlug}` : ''}`}
              target="_blank"
              className="hover:underline"
            >
              Run in Workshop App
            </Link>
          </div>
          <p className="pt-3 text-sm opacity-75 sm:text-base">{description}</p>
          <Button
            asChild
            variant="outline"
            className="relative mt-5 text-sm font-semibold shadow-sm transition"
            size="sm"
          >
            <Link
              href={`/get-started${moduleSlug ? `?module=${moduleSlug}` : ''}`}
              target="_blank"
            >
              <span className="drop-shadow-md">Get Started</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const WorkshopAppIcon = () => {
  return (
    <div className="shadow-soft-sm flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border bg-foreground/5 bg-gradient-to-tr from-sky-500 to-indigo-500">
      <svg
        className="h-4 w-4"
        viewBox="0 0 14 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.7 5.3L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L4.6 6L0.3 10.3C-0.1 10.7 -0.1 11.3 0.3 11.7C0.5 11.9 0.7 12 1 12C1.3 12 1.5 11.9 1.7 11.7L6.7 6.7C7.1 6.3 7.1 5.7 6.7 5.3Z"
          fill="white"
        />
        <path d="M14 10H7V12H14V10Z" fill="white" />
      </svg>
    </div>
  )
}

export {WorkshopAppBanner, WorkshopAppIcon}
