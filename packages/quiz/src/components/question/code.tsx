import * as React from 'react'
import {
  Question,
  QuestionHeader,
  QuestionBody,
  QuestionFooter,
  QuestionAnswer,
  QuestionSubmit,
  QuestionProps,
  QuestionCode,
} from './index'

const CodeSandbox: React.FC<
  React.PropsWithChildren<{
    question: QuestionProps
  }>
> = ({question}) => {
  return (
    <Question {...question}>
      <QuestionHeader />
      <QuestionBody>
        <QuestionCode />
        <QuestionSubmit>Submit</QuestionSubmit>
        <QuestionAnswer />
      </QuestionBody>
      <QuestionFooter />
    </Question>
  )
}

export default CodeSandbox
