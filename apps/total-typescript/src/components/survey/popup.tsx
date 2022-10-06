import React from 'react'
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion'
import {questionToShow} from '@skillrecordings/quiz'
import {XIcon} from '@heroicons/react/solid'
import {useSurvey} from 'hooks/use-survey'
import cx from 'classnames'

export const SurveyPopup = () => {
  const {
    question,
    popup: {isPopupOpen},
  } = useSurvey()

  return question.currentOffer ? (
    <AnimatePresence initial={false}>
      {isPopupOpen && (
        <Popup>
          <div data-sr-quiz={question.isAnswered ? 'answered' : ''}>
            {question.currentOffer && questionToShow(question)}
          </div>
          <div
            className="w-full flex items-center justify-center -translate-y-5"
            id="rewardId"
          />
        </Popup>
      )}
    </AnimatePresence>
  ) : null
}

const Popup: React.FC<React.PropsWithChildren> = ({children}) => {
  const {
    question,
    popup: {isPopupOpen, handleClose, handleDontSurvey},
  } = useSurvey()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={!shouldReduceMotion ? {opacity: 0, y: '100%'} : {}}
      animate={!shouldReduceMotion ? {opacity: 1, y: '0%'} : {}}
      exit={!shouldReduceMotion ? {opacity: 0, y: '100%'} : {}}
      transition={isPopupOpen ? {duration: 0.8} : {duration: 0.2}}
      id="popup"
      className={cx(
        'sm:block hidden fixed bottom-5 right-5 bg-gray-800 border border-gray-700/80 rounded-md w-72 z-10 shadow-xl',
      )}
    >
      {children}
      {!question.isAnswered && (
        <>
          <button
            className="absolute top-0 right-0 text-gray-300 p-1 rounded hover:bg-gray-700/50 transition"
            type="button"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <XIcon className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            className="absolute left-3 bottom-3 text-gray-300 text-sm p-2 rounded hover:underline"
            type="button"
            onClick={handleDontSurvey}
          >
            don't ask again
          </button>
        </>
      )}
    </motion.div>
  )
}

export default SurveyPopup
