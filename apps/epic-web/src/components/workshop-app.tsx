import {cn} from '@skillrecordings/ui/utils/cn'
import React from 'react'
import {motion} from 'framer-motion'
import {CodeIcon, TerminalIcon} from '@heroicons/react/outline'
import {Button} from '@skillrecordings/ui'
import Link from 'next/link'

const WorkshopAppBanner: React.FC<{className?: string}> = ({className}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex items-center gap-4 text-xl font-bold leading-tight">
            <WorkshopAppIcon /> Run in Workshop App
          </div>
          <p className="pt-3 opacity-75">
            Best way to experience Epic Web workshops is with accompanying
            Workshop App.
          </p>
          <Button
            asChild
            variant="secondary"
            className="relative mt-5 text-sm font-semibold shadow-sm transition hover:brightness-110"
            size="sm"
          >
            <Link href="/get-started">
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
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border bg-foreground/5 bg-gradient-to-tr from-sky-500 to-indigo-500 shadow-soft-sm lg:-ml-14">
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
