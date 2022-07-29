import * as React from 'react'
import {
  Question,
  QuestionHeader,
  QuestionBody,
  QuestionFooter,
  QuestionAnswer,
  QuestionSubmit,
  QuestionProps,
  QuestionInput,
} from './index'

const Essay: React.FC<
  React.PropsWithChildren<{
    question: QuestionProps
  }>
> = ({question}) => {
  return (
    <Question {...question}>
      <QuestionHeader />
      <QuestionBody>
        <QuestionInput />
        <QuestionSubmit>Submit</QuestionSubmit>
        <QuestionAnswer />
      </QuestionBody>
      <QuestionFooter />
    </Question>
  )
}

export default Essay
