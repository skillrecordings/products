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
  } = useSurveyPageOfferMachine(TYPESCRIPT_2024_SURVEY_ID)

  const [email, setEmail] = React.useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email and answers to your backend
    console.log('Submitting email and answers:', email, answers)
    // After successful submission, you might want to show a final thank you message
    sendToMachine('OFFER_COMPLETE')
  }

  if (isLoading) {
    return <div>Loading survey...</div>
  }

  if (isComplete) {
    return <div>Survey completed. Thank you!</div>
  }

  if (!currentQuestion && !isPresenting) {
    return <div>No survey available at this time.</div>
  }

  if (!currentQuestion && isPresenting && !subscriber) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <h2 className="mb-4 text-2xl font-bold">
          Thank you for completing the survey!
        </h2>
        <p className="mb-4">
          Please enter your email to receive updates and insights based on the
          survey results:
        </p>
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 w-full rounded border p-2"
            placeholder="Your email"
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    )
  }

  return (
    <div id="ask">
      <SurveyPage
        currentQuestion={currentQuestion as QuestionResource}
        handleSubmitAnswer={handleSubmitAnswer}
        surveyConfig={typescript2024SurveyConfig}
        sendToMachine={sendToMachine}
        isComplete={isComplete}
      />
    </div>
  )
}

export default SurveyPageWrapper
