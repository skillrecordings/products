import * as React from 'react'
import {
  Question,
  QuestionHeader,
  QuestionChoices,
  QuestionBody,
  QuestionFooter,
  QuestionAnswer,
  QuestionSubmit,
  QuestionProps,
} from './index'

const MultipleImageChoice: React.FC<
  React.PropsWithChildren<{
    question: QuestionProps
  }>
> = ({question}) => {
  return (
    <Question {...question}>
      <QuestionHeader />
      <QuestionBody>
        <QuestionChoices />
        <QuestionSubmit>Submit</QuestionSubmit>
        <QuestionAnswer />
      </QuestionBody>
      <QuestionFooter />
    </Question>
  )
}

export default MultipleImageChoice
