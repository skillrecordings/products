import * as React from 'react'
import {SurveyPage} from '../offer/survey/survey-page'
import {useSurveyPageOfferMachine} from '../offer/use-survey-page-offer-machine'
import {
  typescript2024SurveyConfig,
  TYPESCRIPT_2024_SURVEY_ID,
} from '../offer/survey/survey-config'
import {QuestionResource} from '@skillrecordings/types'
import {trpc} from '@/trpc/trpc.client'
import Layout from '@/components/app/layout'

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

  const answerSurveyMutation = trpc.convertkit.answerSurvey.useMutation()
  const answerSurveyMultipleMutation =
    trpc.convertkit.answerSurveyMultiple.useMutation()
  const [email, setEmail] = React.useState<string | null>(null)

  const handleEmailSubmit = async (email: string) => {
    // Here you would typically send the email and answers to your backend
    setEmail(email)
    sendToMachine('EMAIL_COLLECTED')
  }

  React.useEffect(() => {
    if (isComplete && machineState.matches('offerComplete')) {
      answerSurveyMultipleMutation.mutate({
        email: email || subscriber?.email_address,
        answers,
        surveyId: TYPESCRIPT_2024_SURVEY_ID,
      })
    }
  }, [isComplete])

  return (
    <Layout
      meta={{
        title: 'Survey',
      }}
    >
      <div id="ask">
        {isLoading ? (
          <div className="text-center text-2xl">Loading survey...</div>
        ) : !currentQuestion && !isPresenting ? (
          <div className="text-center text-2xl">
            No survey available at this time.
          </div>
        ) : (
          <SurveyPage
            currentQuestionId={currentQuestionId}
            currentQuestion={currentQuestion as QuestionResource}
            handleSubmitAnswer={async (context) => {
              if (email || subscriber?.email_address) {
                answerSurveyMutation.mutate({
                  answer: context.answer,
                  question: context.currentQuestionId,
                })
              }
              await handleSubmitAnswer(context)
            }}
            surveyConfig={typescript2024SurveyConfig}
            sendToMachine={sendToMachine}
            isComplete={isComplete}
            showEmailQuestion={machineState.matches('collectEmail')}
            onEmailSubmit={handleEmailSubmit}
          />
        )}
      </div>
    </Layout>
  )
}

export default SurveyPageWrapper
