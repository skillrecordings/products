'use client'

import {useMedia} from 'react-use'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'

import {Message} from '@/components/icons'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import {useFeedback} from '@/feedback-widget/feedback-context'

const FeedbackButton = ({handlerCloseMenu}: {handlerCloseMenu: () => void}) => {
  const {setIsFeedbackDialogOpen} = useFeedback()
  const isTablet = useMedia('(max-width: 920px)', false)
  return (
    <TooltipProvider delayDuration={0}>
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
              handlerCloseMenu()
              setIsFeedbackDialogOpen(true)
            }}
          >
            Send Feedback
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send feedback</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default FeedbackButton
