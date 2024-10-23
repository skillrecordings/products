import * as React from 'react'
import {
  SurveyQuestion,
  SurveyQuestionHeader,
  SurveyQuestionBody,
  SurveyQuestionChoices,
  SurveyQuestionSubmit,
  SurveyQuestionAnswer,
  SurveyQuestionFooter,
  SurveyQuestionEssay,
} from './survey-question'
import {QuestionResource} from '@skillrecordings/types'
import {SurveyMachineContext} from './survey-machine'
import {SurveyConfig} from './survey-config'
import {OfferMachineEvent} from '../offer-machine'

type SurveyPageProps = {
  currentQuestion: QuestionResource
  handleSubmitAnswer: (context: SurveyMachineContext) => Promise<any>
  surveyConfig: SurveyConfig
  sendToMachine: (event: OfferMachineEvent) => void
  isComplete: boolean
}

export const SurveyPage: React.FC<SurveyPageProps> = ({
  currentQuestion,
  handleSubmitAnswer,
  surveyConfig,
  sendToMachine,
  isComplete,
}) => {
  const handleAnswerSubmit = async (context: SurveyMachineContext) => {
    await handleSubmitAnswer(context)
    console.log('handleAnswerSubmit (survey page)', context)
    sendToMachine({type: 'RESPONDED_TO_OFFER'})
  }

  console.log('currentQuestion', currentQuestion)

  console.log('isComplete', isComplete)

  return (
    <div className="mx-auto max-w-2xl p-6">
      {!isComplete ? (
        <SurveyQuestion
          config={surveyConfig}
          isLast={false}
          handleSubmitAnswer={handleAnswerSubmit}
          currentQuestion={currentQuestion}
        >
          <SurveyQuestionHeader />
          <SurveyQuestionBody>
            {currentQuestion.type === 'essay' ? (
              <SurveyQuestionEssay />
            ) : (
              <SurveyQuestionChoices />
            )}
            <SurveyQuestionSubmit>Submit</SurveyQuestionSubmit>
            <SurveyQuestionAnswer />
          </SurveyQuestionBody>
          <SurveyQuestionFooter />
        </SurveyQuestion>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold">Thank you for your responses!</h2>
          <p className="mt-2">Your answers have been recorded.</p>
        </div>
      )}
    </div>
  )
}
