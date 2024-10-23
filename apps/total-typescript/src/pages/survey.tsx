import * as React from 'react'
import {SurveyPage} from '../offer/survey/survey-page'
import {useSurveyPageOfferMachine} from '../offer/use-survey-page-offer-machine'
import {
  typescript2024SurveyConfig,
  TYPESCRIPT_2024_SURVEY_ID,
} from '../offer/survey/survey-config'
import {QuestionResource} from '@skillrecordings/types'

const SurveyPageWrapper: React.FC = () => {
  const {
    currentQuestion,
    isLoading,
    isComplete,
    isPresenting,
    sendToMachine,
    handleSubmitAnswer,
    subscriber,
    answers,
    machineState,
  } = useSurveyPageOfferMachine(TYPESCRIPT_2024_SURVEY_ID)

  const handleEmailSubmit = async (email: string) => {
    // Here you would typically send the email and answers to your backend
    console.log('Submitting email and answers:', email, answers)
    // After successful submission, you might want to show a final thank you message
    sendToMachine('EMAIL_COLLECTED')
  }

  if (isLoading) {
    return <div>Loading survey...</div>
  }

  if (!currentQuestion && !isPresenting) {
    return <div>No survey available at this time.</div>
  }

  return (
    <div id="ask">
      <SurveyPage
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
