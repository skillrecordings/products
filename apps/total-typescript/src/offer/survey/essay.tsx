import * as React from 'react'
import {
  SurveyQuestion,
  SurveyQuestionHeader,
  SurveyQuestionBody,
  SurveyQuestionFooter,
  SurveyQuestionAnswer,
  SurveyQuestionSubmit,
  SurveyQuestionProps,
  SurveyQuestionInput,
} from './survey-question'

const Essay: React.FC<
  React.PropsWithChildren<{
    question: SurveyQuestionProps
  }>
> = ({question}) => {
  return (
    <SurveyQuestion {...question}>
      <SurveyQuestionHeader />
      <SurveyQuestionBody>
        <SurveyQuestionInput />
        <SurveyQuestionSubmit>Submit</SurveyQuestionSubmit>
        <SurveyQuestionAnswer />
      </SurveyQuestionBody>
      <SurveyQuestionFooter />
    </SurveyQuestion>
  )
}

export default Essay
