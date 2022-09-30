import React from 'react'
import {QuestionProps} from '@skillrecordings/quiz/dist/components/question'
import {surveyData, surveyConfig} from 'components/survey/survey-config'
import {QuestionResource} from '@skillrecordings/types'
import {useQuestion} from '@skillrecordings/quiz'
import {useConvertkit} from './use-convertkit'
import {useReward} from 'react-rewards'
import {useRouter} from 'next/router'
import {SURVEY_ID} from 'pages/ask'
import sample from 'lodash/sample'
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

export const SurveyProvider: React.FC<
  React.PropsWithChildren<SurveyProviderProps>
> = ({children}) => {
  const survey = get(surveyData, SURVEY_ID)
  const [randomQuestion] = React.useState(sample(survey.questions)) // TODO: filter out answered questions

  const question = useQuestion({
    currentQuestion: randomQuestion,
    questionSet: survey.questions,
    config: surveyConfig,
  })

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
  const excludePages = ['/ask', '/confirm', '/confirmed']

  React.useEffect(() => {
    if (excludePages.includes(router.pathname)) {
      setIsPopupClosed(true)
    } else {
      // TODO: keep closed if already answered
      setIsPopupClosed(!Boolean(subscriber && !loadingSubscriber))
    }
  }, [subscriber, loadingSubscriber, router])

  const {reward} = useReward('rewardId', 'confetti', {
    zIndex: 50,
    lifetime: 80,
    startVelocity: 30,
    position: 'absolute',
  })

  const handleAnswerSurvey = async () => {
    // TODO: keep track of answered questions or update ck cookie accordingly
    return setTimeout(() => {
      setIsPopupClosed(true)
    }, 900)
  }

  React.useEffect(() => {
    if (question.isAnswered && !question.isSubmitting) {
      reward()
      handleAnswerSurvey()
    }
  }, [question.isAnswered])

  const handleClose = () => {
    setIsPopupClosed(true)
  }
  const handleDontSurvey = () => {
    // TODO: set a cookie?
    handleClose()
  }

  return {isPopupClosed, handleClose, handleDontSurvey}
}
