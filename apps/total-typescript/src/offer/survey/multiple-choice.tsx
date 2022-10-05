import * as React from 'react'
import {
  SurveyQuestion,
  SurveyQuestionHeader,
  SurveyQuestionChoices,
  SurveyQuestionBody,
  SurveyQuestionFooter,
  SurveyQuestionAnswer,
  SurveyQuestionSubmit,
  SurveyQuestionProps,
} from './survey-question'

const MultipleChoice: React.FC<
  React.PropsWithChildren<{
    question: SurveyQuestionProps
  }>
> = ({question}) => {
  return (
    <SurveyQuestion {...question}>
      <SurveyQuestionHeader />
      <SurveyQuestionBody>
        <SurveyQuestionChoices />
        <SurveyQuestionSubmit>Submit</SurveyQuestionSubmit>
        <SurveyQuestionAnswer />
      </SurveyQuestionBody>
      <SurveyQuestionFooter />
    </SurveyQuestion>
  )
}

export default MultipleChoice
