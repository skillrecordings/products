import * as React from 'react'
import {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import type {Question, Questions} from '@skillrecordings/types'
import useQuestion from '../../../hooks/use-quiz-question'
import SubmitButton from '../../submit'
import CompletedMessage from '../../completed'

const EssayQuestion: FunctionComponent<{
  question: Question
  questions: Questions
  author?: string
  title?: string
}> = ({question, questions, author, title}) => {
  const {formik, onAnswer, isAnswered, isSubmitting} = useQuestion(
    question,
    questions,
  )

  return (
    <form data-sr-quiz-form="essay" onSubmit={onAnswer}>
      <legend data-sr-quiz-question>
        <Markdown children={question?.question} />
      </legend>
      <label data-sr-quiz-form-label htmlFor="answer">
        Your answer
      </label>
      <textarea
        required
        data-sr-quiz-form-textarea
        disabled={isAnswered}
        name="answer"
        id="answer"
        onChange={formik.handleChange}
        rows={6}
        placeholder="Type your answer here..."
      />

      {!isAnswered && (
        <>
          {formik.errors.answer && (
            <div data-sr-quiz-form-error>
              <span role="img" aria-label="alert">
                ⚠️
              </span>{' '}
              {formik.errors.answer}
            </div>
          )}
          <SubmitButton isSubmitting={isSubmitting} isAnswered={isAnswered} />
        </>
      )}

      {isAnswered && question?.answer && (
        <div data-sr-quiz-form-answer>
          <Markdown children={question.answer} />
        </div>
      )}
      {isAnswered && (
        <CompletedMessage
          questions={questions}
          question={question}
          neutral={true}
          author={author}
          title={title}
        />
      )}
    </form>
  )
}

export default EssayQuestion
