import React from 'react'
import {QuestionProps} from '@skillrecordings/quiz/dist/components/question'
import {QuizContext} from '@skillrecordings/quiz/dist/machines/quiz-machine'
import {surveyData, surveyConfig} from 'components/survey/survey-config'
import {QuestionResource} from '@skillrecordings/types'
import {useQuestion} from '@skillrecordings/quiz'
import {useConvertkit} from './use-convertkit'
import {isBefore, subDays} from 'date-fns'
import {useReward} from 'react-rewards'
import {useRouter} from 'next/router'
import {SURVEY_ID} from 'pages/ask'
import {trpc} from '../utils/trpc'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

type SurveyContextType = {
  question: QuestionProps
  popup: {
    isPopupClosed: boolean
    handleClose: () => void
    handleDontSurvey: () => void
  }
}

export const SurveyContext = React.createContext({} as SurveyContextType)

type SurveyProviderProps = {
  currentQuestion?: QuestionResource
}

const DAYS_TO_WAIT_BETWEEN_QUESTIONS = 3

export const SurveyProvider: React.FC<
  React.PropsWithChildren<SurveyProviderProps>
> = ({children}) => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const currentSurveySlug = SURVEY_ID
  const survey = get(surveyData, currentSurveySlug)
  const answerSurveyMutation = trpc.useMutation(['convertkit.answerSurvey'])
  const [currentQuestion, setCurrentQuestion] = React.useState<string>('')

  const question = useQuestion({
    currentQuestion: survey.questions[currentQuestion],
    currentQuestionKey: currentQuestion,
    questionSet: survey.questions,
    config: surveyConfig,
    handleSubmitAnswer: async ({
      answer,
      currentQuestionKey: question,
    }: QuizContext) => {
      if (answer && question) {
        answerSurveyMutation.mutate({
          answer,
          question,
        })
      }
    },
  })

  React.useEffect(() => {
    if (subscriber && subscriber.fields) {
      const lastSurveyDate = new Date(subscriber.fields.last_surveyed_on || 0)

      const thresholdDate = subDays(new Date(), DAYS_TO_WAIT_BETWEEN_QUESTIONS)

      const canSurvey =
        isBefore(lastSurveyDate, thresholdDate) &&
        subscriber.fields.do_not_survey !== 'true' &&
        subscriber.state === 'active'

      for (const question in survey.questions) {
        if (canSurvey && isEmpty(subscriber.fields[question])) {
          setCurrentQuestion(question)
          break
        }
      }
    }
  }, [subscriber, survey.questions])

  const popup = useFloatingPopupWidget(question)
  const context = {question, popup}

  return (
    <SurveyContext.Provider value={context}>{children}</SurveyContext.Provider>
  )
}

export const useSurvey = () => {
  const surveyPopupContext = React.useContext(SurveyContext)
  return surveyPopupContext
}

const useFloatingPopupWidget = (question: QuestionProps) => {
  const router = useRouter()
  const {subscriber, loadingSubscriber} = useConvertkit()
  const [isPopupClosed, setIsPopupClosed] = React.useState(true)
  const excludePages = [
    '/ask',
    '/confirm',
    '/confirmed',
    '/tutorials/[module]/[exercise]',
  ]
  const answerSurveyMutation = trpc.useMutation(['convertkit.answerSurvey'])
  const pathIsValid = !excludePages.includes(router.pathname)
  const subscriberReady = Boolean(subscriber && !loadingSubscriber)
  React.useEffect(() => {
    if (pathIsValid) {
      setIsPopupClosed(!subscriberReady)
    } else {
      setIsPopupClosed(true)
    }
  }, [subscriberReady, pathIsValid])

  const {reward} = useReward('rewardId', 'confetti', {
    zIndex: 50,
    lifetime: 80,
    startVelocity: 30,
    position: 'absolute',
  })

  const handleAnswerSurvey = async () => {
    return setTimeout(() => {
      setIsPopupClosed(true)
    }, 900)
  }

  const answerSubmitted = question.isAnswered && !question.isSubmitting

  React.useEffect(() => {
    if (answerSubmitted) {
      !isPopupClosed && reward()
      handleAnswerSurvey()
    }
  }, [answerSubmitted, reward, isPopupClosed])

  const handleClose = React.useCallback(() => {
    answerSurveyMutation.mutate({
      answer: 'skip',
      question: question.currentQuestionId || `none`,
    })
    setIsPopupClosed(true)
  }, [])

  const handleDontSurvey = () => {
    answerSurveyMutation.mutate({
      answer: 'true',
      question: 'do_not_survey',
    })
    handleClose()
  }

  return {isPopupClosed, handleClose, handleDontSurvey}
}
