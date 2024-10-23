import * as React from 'react'
import {SurveyPage} from '../offer/survey/survey-page'
import {useSurveyPageOfferMachine} from '../offer/use-survey-page-offer-machine'
import {
  typescript2024SurveyConfig,
  TYPESCRIPT_2024_SURVEY_ID,
} from '../offer/survey/survey-config'
import {QuestionResource} from '@skillrecordings/types'
import {trpc} from '@/trpc/trpc.client'

const SurveyPageWrapper: React.FC = () => {
  const {
    currentQuestion,
    currentQuestionId,
    isLoading,
    isComplete,
    isPresenting,
    sendToMachine,
    handleSubmitAnswer,
    subscriber,
    answers,
    machineState,
  } = useSurveyPageOfferMachine(TYPESCRIPT_2024_SURVEY_ID)

  const answerSurveyMutation =
    trpc.convertkit.answerSurveyMultiple.useMutation()
  const [email, setEmail] = React.useState<string | null>(null)

  const handleEmailSubmit = async (email: string) => {
    // Here you would typically send the email and answers to your backend
    setEmail(email)
    sendToMachine('EMAIL_COLLECTED')
  }

  React.useEffect(() => {
    if (isComplete && machineState.matches('offerComplete')) {
      answerSurveyMutation.mutate({
        email: email || subscriber?.email_address,
        answers,
        surveyId: TYPESCRIPT_2024_SURVEY_ID,
      })
    }
  }, [isComplete])

  if (isLoading) {
    return <div>Loading survey...</div>
  }

  if (!currentQuestion && !isPresenting) {
    return <div>No survey available at this time.</div>
  }

  return (
    <div id="ask">
      <SurveyPage
        currentQuestionId={currentQuestionId}
        currentQuestion={currentQuestion as QuestionResource}
        handleSubmitAnswer={handleSubmitAnswer}
        surveyConfig={typescript2024SurveyConfig}
        sendToMachine={sendToMachine}
        isComplete={isComplete}
        showEmailQuestion={machineState.matches('collectEmail')}
        onEmailSubmit={handleEmailSubmit}
      />
    </div>
  )
}

export default SurveyPageWrapper
