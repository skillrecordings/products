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
} from '../survey/survey-question'
import * as React from 'react'
import {XIcon} from '@heroicons/react/solid'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import cx from 'classnames'
import {surveyConfig} from '../../components/survey/survey-config'
import {QuestionResource} from '@skillrecordings/types'
import {SurveyMachineContext} from '../survey/survey-machine'

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
  isPopupOpen?: boolean
  handlePopupDismissed: () => void
  handlePopupClosed: () => void
  handleSubmitAnswer: (context: SurveyMachineContext) => Promise<any>
}

export const SurveyPopup = ({
  currentQuestion,
  isPopupOpen = false,
  handlePopupDismissed,
  handlePopupClosed,
  handleSubmitAnswer,
}: SurveyPopupProps) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="relative">
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
                'sm:block hidden fixed bottom-5 right-5 bg-gray-800 border border-gray-700/80 rounded-md w-72 z-10 shadow-xl',
              )}
            >
              <PopupSurveyQuestion
                config={surveyConfig}
                isLast={false}
                handleSubmitAnswer={handleSubmitAnswer}
                currentQuestion={currentQuestion}
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
        className="w-full flex items-center justify-center -translate-y-5"
        id="rewardId"
      />
      {!isAnswered && (
        <>
          <button
            className="absolute top-0 right-0 text-gray-300 p-1 rounded hover:bg-gray-700/50 transition"
            type="button"
            onClick={handlePopupClosed}
          >
            <span className="sr-only">Close</span>
            <XIcon className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            className="absolute left-3 bottom-3 text-gray-300 text-sm p-2 rounded hover:underline"
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
