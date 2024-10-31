import * as React from 'react'
import {
  SurveyQuestion,
  SurveyQuestionAnswer,
  SurveyQuestionBody,
  SurveyQuestionChoices,
  SurveyQuestionContext,
  SurveyQuestionFooter,
  SurveyQuestionHeader,
  SurveyQuestionProps,
  SurveyQuestionSubmit,
} from './survey-question'
import {XIcon} from '@heroicons/react/solid'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import cx from 'classnames'
import {QuestionResource} from '@skillrecordings/types'
import {SurveyMachineContext} from './survey-machine'
import {SurveyConfig} from './survey-config'

type CurrentOfferPopupContextValue = {
  isPopupOpen: boolean
  handlePopupDismissed: () => void
  handlePopupClosed: () => void
}

const CurrentOfferPopupContext = React.createContext({
  isPopupOpen: false,
  handlePopupDismissed: () => {},
  handlePopupClosed: () => {},
} as CurrentOfferPopupContextValue)

type SurveyPopupProps = {
  currentQuestion: QuestionResource
  currentQuestionId: string
  isPopupOpen?: boolean
  handlePopupDismissed: () => void
  handlePopupClosed: () => void
  handleSubmitAnswer: (context: SurveyMachineContext) => Promise<any>
  surveyConfig: SurveyConfig
}

export const SurveyPopup = ({
  currentQuestion,
  currentQuestionId,
  isPopupOpen = false,
  handlePopupDismissed,
  handlePopupClosed,
  handleSubmitAnswer,
  surveyConfig,
}: SurveyPopupProps) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="relative print:hidden">
      <CurrentOfferPopupContext.Provider
        value={{isPopupOpen, handlePopupDismissed, handlePopupClosed}}
      >
        <AnimatePresence initial={false}>
          {isPopupOpen && (
            <motion.div
              initial={!shouldReduceMotion ? {opacity: 0, y: '100%'} : {}}
              animate={!shouldReduceMotion ? {opacity: 1, y: '0%'} : {}}
              exit={!shouldReduceMotion ? {opacity: 0, y: '100%'} : {}}
              transition={isPopupOpen ? {duration: 0.3} : {duration: 0.2}}
              id="popup"
              className={cx(
                'fixed bottom-5 right-5 z-10 hidden w-72 rounded-md border border-gray-700/80 bg-gray-800 shadow-xl sm:block',
              )}
            >
              <PopupSurveyQuestion
                config={surveyConfig}
                isLast={false}
                handleSubmitAnswer={handleSubmitAnswer}
                currentQuestion={currentQuestion}
                currentQuestionId={currentQuestionId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CurrentOfferPopupContext.Provider>
    </div>
  )
}

/**
 * Structured layout for a popup survey question
 * @param children
 * @param props
 * @constructor
 */
const PopupSurveyQuestion = ({children, ...props}: SurveyQuestionProps) => {
  return (
    <SurveyQuestion {...props}>
      <SurveyPopupQuestionLayout>
        <SurveyQuestionHeader />
        <SurveyQuestionBody>
          <SurveyQuestionChoices />
          <SurveyQuestionSubmit>Submit</SurveyQuestionSubmit>
          <SurveyQuestionAnswer />
        </SurveyQuestionBody>
        <SurveyQuestionFooter />
      </SurveyPopupQuestionLayout>
      {children}
      <SurveyPopupDismissalButtons />
    </SurveyQuestion>
  )
}

/**
 * simple wrapper for the contents of the popup survey used for styling/layout
 * @param children
 * @constructor
 */
const SurveyPopupQuestionLayout = ({children}: {children: React.ReactNode}) => {
  const {surveyMachineState} = React.useContext(SurveyQuestionContext)
  const isAnswered = surveyMachineState.matches('answered')
  return <div data-sr-quiz={isAnswered ? 'answered' : ''}>{children}</div>
}

/**
 * close and dismissal buttons for the survey popup
 * @constructor
 */
const SurveyPopupDismissalButtons = () => {
  const {surveyMachineState} = React.useContext(SurveyQuestionContext)
  const {handlePopupDismissed, handlePopupClosed} = React.useContext(
    CurrentOfferPopupContext,
  )
  const isAnswered = surveyMachineState.matches('answered')
  return (
    <>
      <div
        className="flex w-full -translate-y-5 items-center justify-center"
        id="rewardId"
      />
      {!isAnswered && (
        <>
          <button
            className="absolute right-0 top-0 rounded p-1 text-gray-300 transition hover:bg-gray-700/50"
            type="button"
            onClick={handlePopupClosed}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            className="absolute bottom-3 left-3 rounded p-2 text-sm text-gray-300 hover:underline"
            type="button"
            onClick={handlePopupDismissed}
          >
            don't ask again
          </button>
        </>
      )}
    </>
  )
}
