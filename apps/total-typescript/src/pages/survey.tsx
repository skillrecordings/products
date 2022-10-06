import * as React from 'react'
import {useMachine} from '@xstate/react'
import {offerMachine} from '../offer'
import {useConvertkit} from '../hooks/use-convertkit'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import cx from 'classnames'
import {XIcon} from '@heroicons/react/solid'
import {surveyConfig, surveyData} from '../components/survey/survey-config'
import {
  SurveyQuestion,
  SurveyQuestionContext,
  SurveyQuestionProps,
  SurveyQuestionAnswer,
  SurveyQuestionBody,
  SurveyQuestionChoices,
  SurveyQuestionFooter,
  SurveyQuestionHeader,
  SurveyQuestionSubmit,
} from '../offer/survey/survey-question'
import {SurveyMachineContext} from '../offer/survey/survey-machine'
import {isBefore, subDays} from 'date-fns'
import isEmpty from 'lodash/isEmpty'

type CurrentOfferPopupContextValue = {
  isPopupOpen: boolean
  handlePopupDismissed: () => void
  handlePopupClosed: () => void
}

export const CurrentOfferPopupContext = React.createContext({
  isPopupOpen: false,
  handlePopupDismissed: () => {},
  handlePopupClosed: () => {},
} as CurrentOfferPopupContextValue)

const availableQuestions = surveyData.ask.questions

const SurveyPage = () => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const [machineState, sendToMachine] = useMachine(offerMachine)
  const [currentQuestion, setCurrentQuestion] = React.useState<string>('')
  const [isPopupOpen, setIsPopupOpen] = React.useState(true)
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log('state:', machineState.value.toString())
    switch (true) {
      case machineState.matches('loadingSubscriber'):
        if (subscriber && !loadingSubscriber) {
          sendToMachine('SUBSCRIBER_LOADED', {subscriber})
        } else if (!subscriber && !loadingSubscriber) {
          sendToMachine('NO_SUBSCRIBER_FOUND')
        }
        break
      case machineState.matches('verifyingOfferEligibility'):
        const lastSurveyDate = new Date(
          subscriber?.fields.last_surveyed_on || 0,
        )
        const DAYS_TO_WAIT_BETWEEN_QUESTIONS = 3
        const thresholdDate = subDays(
          new Date(),
          DAYS_TO_WAIT_BETWEEN_QUESTIONS,
        )
        const canSurvey =
          isBefore(lastSurveyDate, thresholdDate) &&
          subscriber?.fields.do_not_survey !== 'true' &&
          subscriber?.state === 'active'
        if (canSurvey) {
          sendToMachine('OFFER_ELIGIBILITY_VERIFIED')
        }
        break
      case machineState.matches('loadingCurrentOffer'):
        let offerFound = false
        for (const question in availableQuestions) {
          if (subscriber && isEmpty(subscriber.fields[question])) {
            setCurrentQuestion(question)
            sendToMachine('CURRENT_OFFER_READY')
            offerFound = true
            break
          }
        }
        if (!offerFound) sendToMachine('NO_CURRENT_OFFER_FOUND')
        break
      case machineState.matches('acknowledgingDismissal'):
        sendToMachine('DISMISSAL_ACKNOWLEDGED')
        break
      case machineState.matches('processingOfferResponse'):
        sendToMachine('OFFER_COMPLETE')
        break
      case machineState.matches('offerComplete'):
        setIsPopupOpen(false)
        break
    }
  }, [subscriber, loadingSubscriber, machineState, sendToMachine])

  const handlePopupDismissed = async () => {
    console.log('dismiss')
    sendToMachine('OFFER_DISMISSED')
  }

  const handlePopupClosed = async () => {
    console.log('closed')
    sendToMachine('OFFER_CLOSED')
  }

  const handleSubmitAnswer = async (context: SurveyMachineContext) => {
    console.log('submitted stuff', {context})
    setTimeout(() => sendToMachine('RESPONDED_TO_OFFER'), 1250)
  }

  return currentQuestion ? (
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
                currentQuestion={availableQuestions[currentQuestion]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CurrentOfferPopupContext.Provider>
    </div>
  ) : null
}

export default SurveyPage

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
