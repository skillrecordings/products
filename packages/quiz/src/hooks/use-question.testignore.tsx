/**
 * @jest-environment jsdom
 */

// TODO: Fix this test
// It's failing because of the useQuestion hook and its Sandpack imports

import * as React from 'react'
import {QuestionResource} from '@skillrecordings/types'
import {useQuestion} from '../index'
import {render, screen, renderHook} from '@testing-library/react'
import Essay from '../components/question/essay'

const ESSAY_QUESTION: QuestionResource = {
  question: 'Lorem ipsum dolor sit amet?',
  type: 'essay',
}
const MULTIPLE_CHOICE_QUESTION: QuestionResource = {
  question: 'Lorem ipsum dolor sit amet?',
  type: 'multiple-choice',
  tagId: 1234567,
  correct: 'a',
  answer: `Lorem ipsum`,
  choices: [
    {
      answer: 'a',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1634565007/css-destructured-quiz/01-a.png',
    },
    {
      answer: 'b',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1634565007/css-destructured-quiz/01-b.png',
    },
  ],
}

describe('can render questions', () => {
  it('renders essay question', () => {
    const {
      result: {current},
    } = renderHook(() =>
      useQuestion({currentQuestion: ESSAY_QUESTION, questionSet: {}}),
    )

    expect(current).not.toBeUndefined()
    current && render(<Essay question={current} />)
    const submitButton = screen.getByRole('button')
    expect(submitButton).not.toBeUndefined()
    const content = screen.getByText(ESSAY_QUESTION.question)
    expect(content).not.toBeUndefined()
  })

  it('renders multiple-choice question', () => {
    const {
      result: {current},
    } = renderHook(() =>
      useQuestion({currentQuestion: MULTIPLE_CHOICE_QUESTION, questionSet: {}}),
    )
    expect(current).not.toBeUndefined()
    current && render(<Essay question={current} />)
    const submitButton = screen.getByRole('button')
    expect(submitButton).not.toBeUndefined()
    const content = screen.getByText(MULTIPLE_CHOICE_QUESTION.question)
    expect(content).not.toBeUndefined()
  })
})
