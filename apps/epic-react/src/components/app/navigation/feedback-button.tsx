'use client'

import {useMedia} from 'react-use'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'

import {Message, Logout} from '@/components/icons'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import {useFeedback} from '@/components/feedback-widget/feedback-context'

export default () => {
  const {setIsFeedbackDialogOpen} = useFeedback()
  const isTablet = useMedia('(max-width: 920px)', false)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={twMerge(
              cx(
                'w-auto border-none px-3 py-2 text-base text-text transition-opacity duration-150 ease-in-out hover:bg-transparent hover:opacity-100 md:px-2',
                isTablet ? 'opacity-100' : 'opacity-75',
              ),
            )}
            onClick={() => {
              setIsFeedbackDialogOpen(true)
            }}
          >
            {isTablet ? 'Send Feedback' : <Message />}
            <span className="sr-only">Send Feedback</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send feedback</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
