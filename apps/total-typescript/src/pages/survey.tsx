import * as React from 'react'
import {useMachine} from '@xstate/react'
import {offerMachine} from '../offer'
import {useConvertkit} from '../hooks/use-convertkit'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'
import cx from 'classnames'
import {XIcon} from '@heroicons/react/solid'
import {surveyConfig} from '../components/survey/survey-config'
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

const SurveyQuestionWrapper = ({children}: {children: React.ReactNode}) => {
  const {surveyMachineState} = React.useContext(SurveyQuestionContext)
  const isAnswered = surveyMachineState.matches('answered')
  return <div data-sr-quiz={isAnswered ? 'answered' : ''}>{children}</div>
}

const SurveyQuestionDismissalButtons = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const {surveyMachineState} = React.useContext(SurveyQuestionContext)
  const isAnswered = surveyMachineState.matches('answered')
  return (
    <>
      <div
        className="w-full flex items-center justify-center -translate-y-5"
        id="rewardId"
      />
      {!isAnswered && <>{children}</>}
    </>
  )
}

const Question = (props: SurveyQuestionProps) => {
  return (
    <SurveyQuestion {...props}>
      <SurveyQuestionWrapper>
        <SurveyQuestionHeader />
        <SurveyQuestionBody>
          <SurveyQuestionChoices />
          <SurveyQuestionSubmit>Submit</SurveyQuestionSubmit>
          <SurveyQuestionAnswer />
        </SurveyQuestionBody>
        <SurveyQuestionFooter />
      </SurveyQuestionWrapper>
      <SurveyQuestionDismissalButtons>
        <button
          className="absolute top-0 right-0 text-gray-300 p-1 rounded hover:bg-gray-700/50 transition"
          type="button"
        >
          <span className="sr-only">Close</span>
          <XIcon className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          className="absolute left-3 bottom-3 text-gray-300 text-sm p-2 rounded hover:underline"
          type="button"
        >
          don't ask again
        </button>
      </SurveyQuestionDismissalButtons>
    </SurveyQuestion>
  )
}

const SurveyPage = () => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const [machineState, sendToMachine] = useMachine(offerMachine)
  const shouldReduceMotion = useReducedMotion()
  const isPopupOpen = true

  const question: SurveyQuestionProps = {
    config: surveyConfig,
    isLast: false,
    handleSubmitAnswer: async (context: SurveyMachineContext) => {
      console.log('submitted stuff', {context})
    },
    currentQuestion: {
      question: `Blah?`,
      type: 'multiple-choice',
      choices: [
        {
          answer: 'beginner',
          label: 'Beginner',
        },
        {
          answer: 'advanced-beginner',
          label: 'Advanced Beginner',
        },
      ],
    },
  }

  React.useEffect(() => {
    if (subscriber && !loadingSubscriber) {
      sendToMachine('SUBSCRIBER_LOADED', {subscriber})
    } else if (!subscriber && !loadingSubscriber) {
      sendToMachine('NO_SUBSCRIBER_FOUND')
    }
  }, [subscriber, loadingSubscriber, sendToMachine])

  return (
    <div className="relative">
      <AnimatePresence initial={false}>
        {isPopupOpen && (
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
            <Question {...question} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SurveyPage
