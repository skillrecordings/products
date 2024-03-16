import React from 'react'
import {nextResourceUrlBuilder} from '@/lib/chapters'
import Link, {type LinkProps} from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@skillrecordings/ui/primitives/tooltip'
import {ChevronRightIcon} from '@heroicons/react/outline'

export const NextResource: React.FC<
  React.PropsWithChildren<{
    currentResourceSlug: string
    currentChapterSlug: string
    withSolution?: boolean
    isSolution?: boolean
  }>
> = async ({
  currentResourceSlug,
  currentChapterSlug,
  withSolution = false,
  isSolution = false,
}) => {
  const {url, label} = await nextResourceUrlBuilder(
    currentResourceSlug,
    currentChapterSlug,
    withSolution,
    isSolution, // TODO: handle isSolution
  )

  return url ? (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={url}
          className="flex size-16 items-center justify-center border-l"
        >
          <ChevronRightIcon className="w-5" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  ) : null
}
