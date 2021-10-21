import * as React from 'react'
import {Questions} from '@skillrecordings/types'
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

const MultipleChoice: React.FC<{
  question: QuestionProps
}> = ({question}) => {
  return question ? (
    <>
      <Question {...question}>
        <QuestionHeader />
        <QuestionBody>
          <QuestionChoices />
          <QuestionSubmit>Submit</QuestionSubmit>
          <QuestionAnswer />
        </QuestionBody>
        <QuestionFooter />
      </Question>
    </>
  ) : null
}

export default MultipleChoice
